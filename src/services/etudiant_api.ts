import axios from "axios";

export interface Etudiant {
  Matricule: string;
  idNiveau: string;
  Nom?: string;
  Prenom: string;
  Sexe: string;
  Telephone?: string;
  Email?: string;
  Etablissement?: string;
  Naissance: string;
  Img?: string; // Bien présent et optionnel
  Niveau?: string;
}

export interface Niveau {
  idNiveau: string;
  Niveau: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4040/api";

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

// Créer un étudiant
export async function createEtudiant(data: Omit<Etudiant, 'Niveau'>): Promise<Etudiant | undefined> {
  try {
    const response = await axios.post<Etudiant>(
      `${API_BASE_URL}/etudiants`,
      data
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Erreur lors de la création de l'étudiant"
      );
    }
    throw new Error("Erreur inattendue");
  }
}

// Modifier un étudiant
export async function updateEtudiant(data: Omit<Etudiant, 'Niveau'>): Promise<Etudiant> {
  try {
    const response = await axios.put<Etudiant>(
      `${API_BASE_URL}/etudiants/${data.Matricule}`,
      data
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Erreur lors de la modification de l'étudiant"
      );
    }
    throw new Error("Erreur inattendue");
  }
}

// Supprimer un étudiant
export async function deleteEtudiant(Matricule: string): Promise<void> {
  try {
    await axios.delete(`${API_BASE_URL}/etudiants/${Matricule}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Erreur lors de la suppression de l'étudiant"
      );
    }
    throw new Error("Erreur inattendue");
  }
}

// Obtenir tous les étudiants (avec jointure sur niveaux)
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

// Obtenir un seul étudiant (avec jointure sur niveaux)
export async function getEtudiant(Matricule: string): Promise<Etudiant> {
  try {
    const response = await axios.get<Etudiant>(
      `${API_BASE_URL}/etudiants/${Matricule}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Étudiant non trouvé"
      );
    }
    throw new Error("Erreur inattendue");
  }
}


// Ajoutez cette fonction à la fin du fichier etudiant_api.ts
export async function checkEtudiantExists(Matricule: string): Promise<boolean> {
  try {
    await axios.get(`${API_BASE_URL}/etudiants/${Matricule}`);
    return true;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return false;
    }
    throw new Error("Erreur lors de la vérification de l'existence de l'étudiant");
  }
}