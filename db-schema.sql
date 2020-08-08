DROP DATABASE IF EXISTS knowledge_workspace;
CREATE DATABASE knowledge_workspace;
USE knowledge_workspace;

CREATE TABLE user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
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
    name varchar(255) NOT NULL,
    organization_id INT NOT NULL,
    CONSTRAINT workspace_organization_id FOREIGN KEY (organization_id)
        REFERENCES organization (id)
);
CREATE TABLE folder (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    parent_folder_id INT,
    workspace_id INT NOT NULL,
    CONSTRAINT folder_parent_folder_id FOREIGN KEY (parent_folder_id)
        REFERENCES folder (id),
    CONSTRAINT folder_workspace_id FOREIGN KEY (workspace_id)
        REFERENCES workspace (id)
);

CREATE TABLE entry (
    id INT PRIMARY KEY AUTO_INCREMENT,
    text VARCHAR(2500) NOT NULL,
    author_id INT NOT NULL,
    folder_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT entry_user_id FOREIGN KEY (author_id)
        REFERENCES user (id),
    CONSTRAINT entry_folder_id FOREIGN KEY (folder_id)
        REFERENCES folder (id)
);

