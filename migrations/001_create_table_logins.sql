CREATE TABLE IF NOT EXISTS logins (
    IDLogin INT AUTO_INCREMENT PRIMARY KEY,
    Nom VARCHAR(50),
    Prenom VARCHAR(50),
    Telephone VARCHAR(13),
    Email VARCHAR(50),
    Roles VARCHAR(12),
    Passwd VARCHAR(255),
    Img VARCHAR(255)
);