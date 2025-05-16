// src/api/dashboard_api.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4040/api";

export interface DashboardStats {
  totalStudents: number;
  totalPayments: number;
  totalAmount: number;
  totalMessages: number;
  paymentsByYear: { AnneeUniversitaire: string; NombrePaiements: number }[];
}

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/paiements/stats/dashboard`);
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};