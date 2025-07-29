CREATE DATABASE matcha; (create new database)
USE matcha; (use as current)
SHOW DATABASES;
DROP TABLE usersInfo;
CREATE TABLE usersInfo (
id INT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL,
first_name VARCHAR(255) NOT NULL,
last_name VARCHAR(255) NOT NULL,
password VARCHAR(255) NOT NULL,
is_verified BOOLEAN DEFAULT FALSE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
verification_token VARCHAR(255),
age INT,
gender VARCHAR(255),
sexual_preference VARCHAR(255),
interests JSON,
biography VARCHAR(255)
);

ALTER TABLE usersInfo
ADD COLUMN age INT DEFAULT NULL,
ADD COLUMN gender VARCHAR(255) DEFAULT NULL,
ADD COLUMN sexual_preference VARCHAR(255) DEFAULT NULL,
ADD COLUMN interests JSON DEFAULT NULL,
ADD COLUMN images_urls JSON DEFAULT NULL,
ADD COLUMN biography VARCHAR(255) DEFAULT NULL;

DROP TABLE relations;
CREATE TABLE relations (
id INT AUTO_INCREMENT PRIMARY KEY,
actor_user_id INT NOT NULL,
target_user_id INT NOT NULL,
is_like BOOLEAN DEFAULT FALSE,
is_view_profile BOOLEAN DEFAULT FALSE,
is_block BOOLEAN DEFAULT FALSE
);

ALTER TABLE relations
ADD CONSTRAINT unique_actor_target UNIQUE (actor_user_id, target_user_id);

SELECT \* FROM usersInfo;
