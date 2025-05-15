CREATE TABLE IF NOT EXISTS montants (
    idMontant VARCHAR(5) PRIMARY KEY,
    idNiveau VARCHAR(5),
    Montant INT,
    Equipement INT,
    FOREIGN KEY (idNiveau) REFERENCES niveaux(idNiveau) ON DELETE CASCADE ON UPDATE CASCADE
);