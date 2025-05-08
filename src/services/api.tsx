import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080", // URL base da sua API
  headers: {
    "Content-Type": "application/json", // Define que o corpo das requisições será JSON
  },
});
