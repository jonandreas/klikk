// Utility functions for the Klikk demo

// Format price with currency symbol
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate a random order number
export const generateOrderNumber = () => {
  return `KLK-${Math.floor(10000 + Math.random() * 90000)}`;
};

// Simulate API delay
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));