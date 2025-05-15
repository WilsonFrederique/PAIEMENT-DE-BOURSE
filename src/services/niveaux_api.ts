import axios from "axios";

export interface Niveau {
  idNiveau: string;
  Niveau: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4040/api";

// Créer un niveau
export async function createNiveau(data: Niveau): Promise<Niveau | undefined> {
  try {
    const response = await axios.post<Niveau>(
      `${API_BASE_URL}/niveaux`,
      data
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Erreur lors de la création du niveau"
      );
    }
    throw new Error("Erreur inattendue");
  }
}

// Modifier un niveau
export async function updateNiveau(data: Niveau): Promise<Niveau> {
  try {
    const response = await axios.put<Niveau>(
      `${API_BASE_URL}/niveaux/${data.idNiveau}`,
      data
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Erreur lors de la modification du niveau"
      );
    }
    throw new Error("Erreur inattendue");
  }
}

// Supprimer un niveau
export async function deleteNiveau(idNiveau: string): Promise<void> {
  try {
    await axios.delete(`${API_BASE_URL}/niveaux/${idNiveau}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Erreur lors de la suppression du niveau"
      );
    }
    throw new Error("Erreur inattendue");
  }
}

// Obtenir tous les niveaux
export async function getAllNiveaux(): Promise<Niveau[]> {
  try {
    const response = await axios.get<Niveau[]>(
      `${API_BASE_URL}/niveaux`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Erreur lors de la récupération des niveaux"
      );
    }
    throw new Error("Erreur inattendue");
  }
}

// Obtenir un seul niveau
export async function getNiveau(idNiveau: string): Promise<Niveau> {
  try {
    const response = await axios.get<Niveau>(
      `${API_BASE_URL}/niveaux/${idNiveau}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Niveau non trouvé"
      );
    }
    throw new Error("Erreur inattendue");
  }
}