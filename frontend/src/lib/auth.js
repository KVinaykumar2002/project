// JWT token utilities
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

export const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};

// API base URL - Update this if your backend runs on a different port
const API_BASE_URL = 'http://localhost:8080/api';

// API call helper with authorization header
export const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  return fetch(url, config);
};

// Auth-specific API calls
export const authAPI = {
  signup: async (email, password, fullName) => {
    const response = await apiCall('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName }),
    });
    return response.json();
  },

  signin: async (email, password) => {
    const response = await apiCall('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  getMe: async () => {
    const response = await apiCall('/auth/me', {
      method: 'GET',
    });
    return response.json();
  },

  signout: async () => {
    const response = await apiCall('/auth/signout', {
      method: 'POST',
    });
    return response.json();
  },

  refreshToken: async () => {
    const response = await apiCall('/auth/refresh', {
      method: 'POST',
    });
    return response.json();
  }
};