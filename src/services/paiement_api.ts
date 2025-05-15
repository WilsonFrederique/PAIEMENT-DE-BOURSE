import axios from "axios";

export interface Paiement {
  idPaiement?: number;
  idNumCompte: number;
  AnneeUniversitaire: string;
  DateHeur?: string;
  NombreMois: number;
  NumeroCompte?: string;
  Matricule?: string;
  Nom?: string;
  Prenom?: string;
  Sexe?: string;
  Telephone?: string;
  Email?: string;
  Etablissement?: string;
  Naissance?: string;
  Img?: string;
  Niveau?: string;
}

export interface NumCompte {
  idNumCompte: number;
  NumeroCompte: string;
  Matricule: string;
  Nom: string;
  Prenom: string;
  Niveau?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4040/api";

export async function getAllNumComptes(): Promise<NumCompte[]> {
  try {
    const response = await axios.get<NumCompte[]>(
      `${API_BASE_URL}/numcomptes`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Erreur lors de la récupération des numéros de compte"
      );
    }
    throw new Error("Erreur inattendue");
  }
}

export async function createPaiement(data: {
  idNumCompte: number;
  AnneeUniversitaire: string;
  DateHeur: string;
  NombreMois: number;
}): Promise<Paiement> {
  try {
    const response = await axios.post<Paiement>(
      `${API_BASE_URL}/paiements`,
      data,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.status !== 201) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || 
                         error.message || 
                         "Erreur lors de la création du paiement";
      throw new Error(errorMessage);
    }
    throw new Error("Erreur inattendue lors de la création du paiement");
  }
}

export async function updatePaiement(
  idPaiement: number, 
  data: {
    AnneeUniversitaire: string;
    DateHeur: string;
    NombreMois: number;
  }
): Promise<Paiement> {
  try {
    const response = await axios.put<Paiement>(
      `${API_BASE_URL}/paiements/${idPaiement}`,
      data,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.status !== 200) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || 
                         error.message || 
                         "Erreur lors de la modification du paiement";
      throw new Error(errorMessage);
    }
    throw new Error("Erreur inattendue lors de la modification du paiement");
  }
}

export async function deletePaiement(idPaiement: number): Promise<void> {
  try {
    await axios.delete(`${API_BASE_URL}/paiements/${idPaiement}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Erreur lors de la suppression du paiement"
      );
    }
    throw new Error("Erreur inattendue");
  }
}

export async function getAllPaiements(): Promise<Paiement[]> {
  try {
    const response = await axios.get<Paiement[]>(
      `${API_BASE_URL}/paiements`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Erreur lors de la récupération des paiements"
      );
    }
    throw new Error("Erreur inattendue");
  }
}

export async function getPaiement(idPaiement: number): Promise<Paiement> {
  try {
    const response = await axios.get<Paiement>(
      `${API_BASE_URL}/paiements/${idPaiement}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Paiement non trouvé"
      );
    }
    throw new Error("Erreur inattendue");
  }
}

export async function getPaiementsByNumCompte(idNumCompte: number): Promise<Paiement[]> {
  try {
    const response = await axios.get<Paiement[]>(
      `${API_BASE_URL}/paiements/compte/${idNumCompte}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Aucun paiement trouvé pour ce numéro de compte"
      );
    }
    throw new Error("Erreur inattendue");
  }
}

export async function getPaiementsByAnneeUniversitaire(annee: string): Promise<Paiement[]> {
  try {
    const response = await axios.get<Paiement[]>(
      `${API_BASE_URL}/paiements/annee/${annee}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Erreur lors de la récupération des paiements par année"
      );
    }
    throw new Error("Erreur inattendue");
  }
}



export const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
};

export const formatDateTime = (dateTimeString: string): string => {
    if (!dateTimeString) return 'N/A';
    
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return 'N/A';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} - ${hours}:${minutes}`;
};