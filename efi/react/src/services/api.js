// src/services/api.js
import axios from "axios";

// URL base del backend Flask
const API_URL = "http://127.0.0.1:5000/api";

// Instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token JWT automaticamente si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


//AUTENTICACION
export const loginUser = async (credentials) => {
  const { data } = await api.post("/login", credentials);
  return data; // data.token será el JWT
};

export const registerUser = async (userData) => {
  const { data } = await api.post("/register", userData);
  return data;
};

export const userGet = async (id)=>{
  const {data} = await api.get(`user/${id}`);
  return data
}




// Posts crud
export const getPosts = async () => {
  const { data } = await api.get("/posts");
  return data;
};

export const createPost = async (postData) => {
  const { data } = await api.post("/posts", postData);
  return data;
};

export const updatePost = async (id, postData) => {
  const { data } = await api.put(`/posts/${id}`, postData);
  return data;
};

export const deletePost = async (id) => {
  const { data } = await api.delete(`/posts/${id}`);
  return data;
};





// reviews cruds



export const getReviews = async () => {
  const { data } = await api.get("/reviews");
  return data;
};

export const createReview = async (reviewData) => {
  const { data } = await api.post("/reviews", reviewData);
  return data;
};

export const updateReview = async (id, reviewData) => {
  const { data } = await api.put(`/reviews/${id}`, reviewData);
  return data;
};

export const deleteReview = async (id) => {
  const { data } = await api.delete(`/reviews/${id}`);
  return data;
};



export default api;

