CREATE DATABASE knowledge_workspace;
USE knowledge_workspace;

DROP TABLE IF EXISTS user;

CREATE TABLE user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE organization (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(127) NOT NULL
);

CREATE TABLE organization_user (
    organization_id INT NOT NULL,
    user_id INT NOT NULL,
    CONSTRAINT organization_user_organization_id FOREIGN KEY (organization_id)
        REFERENCES organization (id),
    CONSTRAINT organization_user_user_id FOREIGN KEY (user_id)
        REFERENCES user (id)
);

CREATE TABLE workspace (
    id INT PRIMARY KEY AUTO_INCREMENT,
    organization_id INT NOT NULL,
    CONSTRAINT workspace_organization_id FOREIGN KEY (organization_id)
        REFERENCES organization (id)
);