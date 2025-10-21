from fastapi import FastAPI, Depends, HTTPException, Request, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from .auth import get_current_user
from .database import SessionLocal, engine
from . import models, schemas

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Your Vite React app's ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
    )

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# User Routes
@app.post("/api/users", response_model=schemas.User)
async def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = models.User(
        email=user.email,
        firebase_uid=user.firebase_uid,
        full_name=user.full_name,
        phone_number=user.phone_number
    )
    db.add(db_user)
    try:
        db.commit()
        db.refresh(db_user)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    return db_user

@app.get("/api/users/me", response_model=schemas.User)
async def read_user_me(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.firebase_uid == current_user["uid"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.put("/api/users/me", response_model=schemas.User)
async def update_user_me(
    user_update: schemas.UserUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_user = db.query(models.User).filter(models.User.firebase_uid == current_user["uid"]).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    for field, value in user_update.dict(exclude_unset=True).items():
        setattr(db_user, field, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

# Product Routes
@app.get("/api/products", response_model=List[schemas.Product])
async def list_products(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Product)
    if category:
        query = query.filter(models.Product.category == category)
    return query.offset(skip).limit(limit).all()

@app.get("/api/products/{product_id}", response_model=schemas.Product)
async def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

# Cart Routes
@app.get("/api/cart", response_model=schemas.CartResponse)
async def get_cart(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.firebase_uid == current_user["uid"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    cart_items = db.query(models.CartItem).filter(models.CartItem.user_id == user.id).all()
    total_amount = sum(item.product.price * item.quantity for item in cart_items)
    
    return schemas.CartResponse(items=cart_items, total_amount=total_amount)

@app.post("/api/cart/items", response_model=schemas.CartItem)
async def add_to_cart(
    item: schemas.CartItemBase,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.firebase_uid == current_user["uid"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if product exists and has enough stock
    product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.stock < item.quantity:
        raise HTTPException(status_code=400, detail="Not enough stock")
    
    # Check if item already exists in cart
    cart_item = db.query(models.CartItem).filter(
        models.CartItem.user_id == user.id,
        models.CartItem.product_id == item.product_id
    ).first()
    
    if cart_item:
        cart_item.quantity += item.quantity
    else:
        cart_item = models.CartItem(
            user_id=user.id,
            product_id=item.product_id,
            quantity=item.quantity
        )
        db.add(cart_item)
    
    db.commit()
    db.refresh(cart_item)
    return cart_item

@app.delete("/api/cart/items/{product_id}")
async def remove_from_cart(
    product_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.firebase_uid == current_user["uid"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    cart_item = db.query(models.CartItem).filter(
        models.CartItem.user_id == user.id,
        models.CartItem.product_id == product_id
    ).first()
    
    if not cart_item:
        raise HTTPException(status_code=404, detail="Item not found in cart")
    
    db.delete(cart_item)
    db.commit()
    return {"status": "success"}

# Order Routes
@app.post("/api/orders", response_model=schemas.Order)
async def create_order(
    order: schemas.OrderCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.firebase_uid == current_user["uid"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Calculate total amount and create order
    total_amount = 0
    order_items = []
    for item in order.items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        if product.stock < item.quantity:
            raise HTTPException(status_code=400, detail=f"Not enough stock for product {item.product_id}")
        
        total_amount += product.price * item.quantity
        order_items.append(models.OrderItem(
            product_id=item.product_id,
            quantity=item.quantity,
            price=product.price
        ))
        
        # Update product stock
        product.stock -= item.quantity
    
    # Create the order
    db_order = models.Order(
        user_id=user.id,
        shipping_address=order.shipping_address,
        total_amount=total_amount,
        items=order_items
    )
    
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    # Clear user's cart
    db.query(models.CartItem).filter(models.CartItem.user_id == user.id).delete()
    db.commit()
    
    return db_order

@app.get("/api/orders", response_model=List[schemas.Order])
async def list_orders(
    current_user: dict = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.firebase_uid == current_user["uid"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    orders = db.query(models.Order).filter(models.Order.user_id == user.id)\
        .order_by(models.Order.created_at.desc())\
        .offset(skip).limit(limit).all()
    return orders

@app.get("/api/orders/{order_id}", response_model=schemas.Order)
async def get_order(
    order_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.firebase_uid == current_user["uid"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    order = db.query(models.Order).filter(
        models.Order.id == order_id,
        models.Order.user_id == user.id
    ).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return order