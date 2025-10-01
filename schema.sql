create schema if not exists tcg_tracker;
use tcg_tracker;

create table user
(
    uID INT AUTO_INCREMENT PRIMARY KEY,
    first_name varchar(30),
    middle_initial char(1),
    last_name varchar(30),
    email varchar(50) UNIQUE,
    dob DATE,
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table collection
(
    uID INT,
    collectionID INT AUTO_INCREMENT,
    collection_name VARCHAR(100),
    descriptor VARCHAR(250),
    size INT DEFAULT 0,
    PRIMARY KEY(uID, collectionID),
    FOREIGN KEY(uID) REFERENCES user(uID) ON DELETE CASCADE
);

create table mtg_card
(
    mtgID INT PRIMARY KEY,
    name VARCHAR(100),
    layout VARCHAR(100),
    cmc INT,
    rarity VARCHAR(100),
    set VARCHAR(100),
    set_name VARCHAR(100),
    text VARCHAR(1000),
    flavor_text VARCHAR(500),
    artist VARCHAR(50),
    card_number VARCHAR(20),
    power VARCHAR(2),
    toughness VARCHAR(2),
    loyalty VARCHAR(2),
    game_format VARCHAR(50),
    names JSON,
    mana_cost VARCHAR(100),
    variations JSON,
    image VARCHAR(200),
    watermark VARCHAR(50),
    border VARCHAR(50)
);

create table mtg_colors
(
    mtgID INT,
    color VARCHAR(20),
    PRIMARY KEY(mtgID, color),
    FOREIGN KEY(mtgID) REFERENCES mtg_card(mtgID)
);

create table mtg_color_identity
(
    mtgID INT,
    color VARCHAR(20)
    PRIMARY KEY(mtgID, color),
    FOREIGN KEY(mtgID) REFERENCES mtg_card(mtgID)
);

create table mtg_supertypes
(
    mtgID INT,
    supertype VARCHAR(50),
    PRIMARY KEY(mtgID, supertype),
    FOREIGN KEY(mtgID) REFERENCES mtg_card(mtgID)
);

create table mtg_types
(
    mtgID INT,
    type VARCHAR(50),
    PRIMARY KEY(mtgID, type),
    FOREIGN KEY(mtgID) REFERENCES mtg_card(mtgID)
);

create table mtg_subtypes
(
    mtgID INT,
    subtype VARCHAR(50),
    PRIMARY KEY(mtgID, subtype),
    FOREIGN KEY(mtgID) REFERENCES mtg_card(mtgID)
);

create table mtg_legality
(
    mtgID INT,
    format VARCHAR(50),
    legality VARCHAR(10),
    PRIMARY KEY(mtgID, format),
    FOREIGN KEY(mtgID) REFERENCES mtg_card(mtgID)
);

create table mtg_names
(
    mtgID INT,
    name VARCHAR(50),
    PRIMARY KEY(mtgID, name),
    FOREIGN KEY(mtgID) REFERENCES mtg_card(mtgID)
);