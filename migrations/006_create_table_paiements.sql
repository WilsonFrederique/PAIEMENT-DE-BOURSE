CREATE TABLE IF NOT EXISTS paiements (
    idPaiement INT AUTO_INCREMENT PRIMARY KEY,
    idNumCompte INT,
    AnneeUniversitaire VARCHAR(11),
    DateHeur datetime,
    NombreMois INT,
    FOREIGN KEY (idNumCompte) REFERENCES tablenumcomptes(idNumCompte) ON DELETE CASCADE ON UPDATE CASCADE
);