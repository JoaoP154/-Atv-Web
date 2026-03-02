CREATE TABLE filmes_joaopedro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    diretor VARCHAR(255) NOT NULL,
    ano_lancamento INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);