import axios from "axios";

export interface Montant {
  idMontant: string;
  idNiveau: string;
  Montant: number;
  Equipement: number;
  Niveau?: string; // Optionnel car vient de la jointure
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4040/api";

// Créer un montant
export async function createMontant(data: Omit<Montant, 'Niveau'>): Promise<Montant | undefined> {
  try {
    const response = await axios.post<Montant>(
      `${API_BASE_URL}/montants`,
      data
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Erreur lors de la création du montant"
      );
    }
    throw new Error("Erreur inattendue");
  }
}

// Modifier un montant
export async function updateMontant(data: Omit<Montant, 'Niveau'>): Promise<Montant> {
  try {
    const response = await axios.put<Montant>(
      `${API_BASE_URL}/montants/${data.idMontant}`,
      data
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Erreur lors de la modification du montant"
      );
    }
    throw new Error("Erreur inattendue");
  }
}

// Supprimer un montant
export async function deleteMontant(idMontant: string): Promise<void> {
  try {
    await axios.delete(`${API_BASE_URL}/montants/${idMontant}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Erreur lors de la suppression du montant"
      );
    }
    throw new Error("Erreur inattendue");
  }
}

// Obtenir tous les montants (avec jointure sur niveaux)
export async function getAllMontants(): Promise<Montant[]> {
  try {
    const response = await axios.get<Montant[]>(
      `${API_BASE_URL}/montants`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Erreur lors de la récupération des montants"
      );
    }
    throw new Error("Erreur inattendue");
  }
}

// Obtenir un seul montant (avec jointure sur niveaux)
export async function getMontant(idMontant: string): Promise<Montant> {
  try {
    const response = await axios.get<Montant>(
      `${API_BASE_URL}/montants/${idMontant}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Montant non trouvé"
      );
    }
    throw new Error("Erreur inattendue");
  }
}

// Vérifier si un ID Montant existe déjà
export async function checkMontantExists(idMontant: string): Promise<boolean> {
  try {
    await axios.get(`${API_BASE_URL}/montants/${idMontant}`);
    return true;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return false;
    }
    throw new Error("Erreur lors de la vérification de l'existence du montant");
  }
}