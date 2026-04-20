// API base configuration
const API_BASE_URL = '/api';

// Generic fetch wrapper with error handling
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API calls
export const authAPI = {
  register: (userData) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  
  login: (credentials) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  
  getProfile: () =>
    apiCall('/auth/profile', {
      method: 'GET',
    }),
};

// Courses API calls
export const coursesAPI = {
  getAllCourses: () =>
    apiCall('/courses', { method: 'GET' }),
  
  getCourseById: (id) =>
    apiCall(`/courses/${id}`, { method: 'GET' }),
  
  createCourse: (courseData) =>
    apiCall('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    }),
  
  updateCourse: (id, courseData) =>
    apiCall(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    }),
  
  deleteCourse: (id) =>
    apiCall(`/courses/${id}`, { method: 'DELETE' }),
};

// Health check
export const checkHealth = () =>
  apiCall('/health', { method: 'GET' });

export default apiCall;
