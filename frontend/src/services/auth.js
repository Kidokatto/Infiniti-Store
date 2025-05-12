import axios from "axios";

const API_URL = "http://localhost:8001/auth";

// Función de login
export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
};

// Función de registro
export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData, {
    headers: {
      "Content-Type": "multipart/form-data", // Especificamos que es un formulario con archivos
    },
  });
  return response.data;
};
