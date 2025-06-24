CREATE DATABASE matcha; (create new database)
USE matcha; (use as current)
SHOW DATABASES;
CREATE TABLE usersInfo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verification_token VARCHAR(255) NOT NULL
);

DROP TABLE usersInfo; (delete table)
SELECT * FROM usersInfo;
