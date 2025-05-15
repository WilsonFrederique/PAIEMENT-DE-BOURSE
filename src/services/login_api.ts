import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4040/api";

export interface User {
  IDLogin?: number;
  Nom?: string;
  Prenom?: string;
  Telephone?: string;
  Email: string;
  Roles?: string;
  Passwd?: string;
  Img?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Register a new user
export async function registerUser(userData: User): Promise<ApiResponse> {
  try {
    const response = await axios.post<ApiResponse>(
      `${API_BASE_URL}/logins/register`,
      userData
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Erreur lors de l'inscription"
      );
    }
    throw new Error("Erreur inattendue lors de l'inscription");
  }
}

// User login
export async function loginUser(
  email: string,
  password: string
): Promise<LoginResponse> {
  try {
    const response = await axios.post<LoginResponse>(
      `${API_BASE_URL}/logins/login`,
      { Email: email, Passwd: password }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Erreur lors de la connexion"
      );
    }
    throw new Error("Erreur inattendue lors de la connexion");
  }
}

// Get all users (admin only)
export async function getAllUsers(token: string): Promise<User[]> {
  try {
    const response = await axios.get<{ success: boolean; data: User[] }>(
      `${API_BASE_URL}/logins/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Erreur lors de la récupération des utilisateurs"
      );
    }
    throw new Error("Erreur inattendue lors de la récupération des utilisateurs");
  }
}

// Get user by ID
export async function getUserById(
  id: number,
  token: string
): Promise<User> {
  try {
    const response = await axios.get<{ success: boolean; data: User }>(
      `${API_BASE_URL}/logins/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Erreur lors de la récupération de l'utilisateur"
      );
    }
    throw new Error("Erreur inattendue lors de la récupération de l'utilisateur");
  }
}

// Update user
export async function updateUser(
  id: number,
  userData: Partial<User>,
  token: string
): Promise<ApiResponse> {
  try {
    const response = await axios.put<ApiResponse>(
      `${API_BASE_URL}/logins/${id}`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Erreur lors de la mise à jour de l'utilisateur"
      );
    }
    throw new Error("Erreur inattendue lors de la mise à jour de l'utilisateur");
  }
}

// Delete user
export async function deleteUser(
  id: number,
  token: string
): Promise<ApiResponse> {
  try {
    const response = await axios.delete<ApiResponse>(
      `${API_BASE_URL}/logins/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Erreur lors de la suppression de l'utilisateur"
      );
    }
    throw new Error("Erreur inattendue lors de la suppression de l'utilisateur");
  }
}

// Update password
export async function updateUserPassword(
  id: number,
  currentPassword: string,
  newPassword: string,
  token: string
): Promise<ApiResponse> {
  try {
    const response = await axios.put<ApiResponse>(
      `${API_BASE_URL}/logins/${id}/password`,
      { currentPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Erreur lors de la mise à jour du mot de passe"
      );
    }
    throw new Error("Erreur inattendue lors de la mise à jour du mot de passe");
  }
}

// Helper function to set auth token in axios defaults
export function setAuthToken(token: string | null) {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
}