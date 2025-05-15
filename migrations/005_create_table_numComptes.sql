CREATE TABLE IF NOT EXISTS tablenumcomptes (
    idNumCompte INT AUTO_INCREMENT PRIMARY KEY,
    Matricule VARCHAR(10),
    NumeroCompte VARCHAR(8),
    FOREIGN KEY (Matricule) REFERENCES etudiants(Matricule) ON DELETE CASCADE ON UPDATE CASCADE
);