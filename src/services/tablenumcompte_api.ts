import axios from "axios";

export interface NumCompte {
  idNumCompte?: number; // Optionnel car auto-incrémenté
  Matricule: string;
  NumeroCompte: string;
  Nom?: string; // Optionnel car vient de la jointure
  Prenom?: string; // Optionnel car vient de la jointure
}

export interface Etudiant {
  Matricule: string;
  Nom: string;
  Prenom: string;
  Img?: string;
  Sexe?: string;
  Telephone?: string;
  Email?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4040/api";

// Obtenir tous les étudiants
export async function getAllEtudiants(): Promise<Etudiant[]> {
  try {
    const response = await axios.get<Etudiant[]>(
      `${API_BASE_URL}/etudiants`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Erreur lors de la récupération des étudiants"
      );
    }
    throw new Error("Erreur inattendue");
  }
}

// Créer un numéro de compte
export async function createNumCompte(data: Omit<NumCompte, 'idNumCompte' | 'Nom' | 'Prenom'>): Promise<NumCompte | undefined> {
  try {
    const response = await axios.post<NumCompte>(
      `${API_BASE_URL}/tablenumcomptes`,
      data
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Erreur lors de la création du numéro de compte"
      );
    }
    throw new Error("Erreur inattendue");
  }
}

// Modifier un numéro de compte
export async function updateNumCompte(idNumCompte: number, data: { NumeroCompte: string }): Promise<NumCompte> {
  try {
    const response = await axios.put<NumCompte>(
      `${API_BASE_URL}/tablenumcomptes/${idNumCompte}`,
      data
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Erreur lors de la modification du numéro de compte"
      );
    }
    throw new Error("Erreur inattendue");
  }
}

// Supprimer un numéro de compte
export async function deleteNumCompte(idNumCompte: number): Promise<void> {
  try {
    await axios.delete(`${API_BASE_URL}/tablenumcomptes/${idNumCompte}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Erreur lors de la suppression du numéro de compte"
      );
    }
    throw new Error("Erreur inattendue");
  }
}

// Obtenir tous les numéros de compte (avec jointure sur étudiants)
export async function getAllNumComptes(): Promise<NumCompte[]> {
  try {
    const response = await axios.get<NumCompte[]>(
      `${API_BASE_URL}/tablenumcomptes`
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

// Obtenir un seul numéro de compte (avec jointure sur étudiants)
export async function getNumCompte(idNumCompte: number): Promise<NumCompte> {
  try {
    const response = await axios.get<NumCompte>(
      `${API_BASE_URL}/tablenumcomptes/${idNumCompte}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Numéro de compte non trouvé"
      );
    }
    throw new Error("Erreur inattendue");
  }
}

// Obtenir les numéros de compte par matricule (avec jointure sur étudiants)
export async function getNumComptesByMatricule(Matricule: string): Promise<NumCompte[]> {
  try {
    const response = await axios.get<NumCompte[]>(
      `${API_BASE_URL}/tablenumcomptes/matricule/${Matricule}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Aucun numéro de compte trouvé pour ce matricule"
      );
    }
    throw new Error("Erreur inattendue");
  }
}