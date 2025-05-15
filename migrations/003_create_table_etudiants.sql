CREATE TABLE IF NOT EXISTS etudiants (
    Matricule VARCHAR(10) PRIMARY KEY,
    idNiveau VARCHAR(5),
    Nom VARCHAR(50),
    Prenom VARCHAR(50),
    Sexe VARCHAR(10),
    Telephone VARCHAR(13),
    Email VARCHAR(50),
    Etablissement VARCHAR(50),
    Naissance date,
    Img VARCHAR(255),
    FOREIGN KEY (idNiveau) REFERENCES niveaux(idNiveau) ON DELETE CASCADE ON UPDATE CASCADE
);