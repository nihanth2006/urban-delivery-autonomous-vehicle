const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'An error occurred');
  }
  return response.json();
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// User related API calls
export const userAPI = {
  getProfile: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateProfile: async (userId, data) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  updateSettings: async (userId, settings) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings),
    });
    return handleResponse(response);
  },
};

// Product related API calls
export const productAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/products`);
    return handleResponse(response);
  },

  getById: async (productId) => {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`);
    return handleResponse(response);
  },

  getByCategory: async (category) => {
    const response = await fetch(`${API_BASE_URL}/products?category=${category}`);
    return handleResponse(response);
  },
};

// Order related API calls
export const orderAPI = {
  create: async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData),
    });
    return handleResponse(response);
  },

  getUserOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/orders/user`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getOrderDetails: async (orderId) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  },
};

// Cart related API calls
export const cartAPI = {
  getCart: async () => {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  addToCart: async (productId, quantity = 1) => {
    const response = await fetch(`${API_BASE_URL}/cart/items`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ product_id: productId, quantity }),
    });
    return handleResponse(response);
  },

  updateCartItem: async (productId, quantity) => {
    const response = await fetch(`${API_BASE_URL}/cart/items/${productId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ quantity }),
    });
    return handleResponse(response);
  },

  removeFromCart: async (productId) => {
    const response = await fetch(`${API_BASE_URL}/cart/items/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};