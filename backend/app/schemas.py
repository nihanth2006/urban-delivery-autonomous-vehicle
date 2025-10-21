from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional
from enum import Enum

class OrderStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

# Product Schemas
class ProductBase(BaseModel):
    title: str
    description: str
    price: float
    category: str
    image_url: str
    stock: int

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# User Schemas
class UserBase(BaseModel):
    email: str
    full_name: str
    phone_number: str

class UserCreate(UserBase):
    firebase_uid: str

class UserUpdate(BaseModel):
    full_name: Optional[str]
    phone_number: Optional[str]

class User(UserBase):
    id: int
    firebase_uid: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# CartItem Schemas
class CartItemBase(BaseModel):
    product_id: int
    quantity: int

class CartItemCreate(CartItemBase):
    user_id: int

class CartItem(CartItemBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    product: Product

    class Config:
        from_attributes = True

# OrderItem Schemas
class OrderItemBase(BaseModel):
    product_id: int
    quantity: int
    price: float

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    id: int
    order_id: int
    created_at: datetime
    product: Product

    class Config:
        from_attributes = True

# Order Schemas
class OrderBase(BaseModel):
    shipping_address: str

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class Order(OrderBase):
    id: int
    user_id: int
    status: OrderStatus
    total_amount: float
    created_at: datetime
    updated_at: Optional[datetime] = None
    items: List[OrderItem]

    class Config:
        from_attributes = True

# Response Schemas
class CartResponse(BaseModel):
    items: List[CartItem]
    total_amount: float

class OrderResponse(BaseModel):
    order: Order
    items: List[OrderItem]