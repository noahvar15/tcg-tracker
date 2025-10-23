CREATE SCHEMA IF NOT EXISTS tcg_tracker;
USE tcg_tracker;


-- =========================================
-- USERS & COLLECTIONS
-- =========================================
CREATE TABLE IF NOT EXISTS user (
    uID INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    middle_initial CHAR(1),
    last_name VARCHAR(30),
    email VARCHAR(50) UNIQUE,
    dob DATE,
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS collection (
    collectionID INT AUTO_INCREMENT PRIMARY KEY,
    uID INT,
    collection_name VARCHAR(100),
    descriptor VARCHAR(250),
    size INT DEFAULT 0,
    FOREIGN KEY (uID) REFERENCES user(uID) ON DELETE CASCADE
);

-- =========================================
-- MAGIC: THE GATHERING
-- =========================================
-- =========================================
-- MAGIC: THE GATHERING
-- =========================================
CREATE TABLE IF NOT EXISTS mtg_card (
    mtgID VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100),
    layout VARCHAR(100),
    cmc INT,
    rarity VARCHAR(100),
    set_code VARCHAR(100),
    set_name VARCHAR(100),
    card_type VARCHAR(100),
    card_text VARCHAR(1000),
    flavor_text VARCHAR(500),
    artist VARCHAR(50),
    card_number VARCHAR(20),
    power VARCHAR(4),
    toughness VARCHAR(4),
    loyalty VARCHAR(3),
    mana_cost VARCHAR(100),
    image VARCHAR(200)
);

CREATE TABLE IF NOT EXISTS mtg_collection (
    mtgID VARCHAR(100),
    collectionID INT,
    PRIMARY KEY (mtgID, collectionID),
    FOREIGN KEY (mtgID) REFERENCES mtg_card(mtgID) ON DELETE CASCADE,
    FOREIGN KEY (collectionID) REFERENCES collection(collectionID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mtg_color (
    mtgID VARCHAR(100),
    color VARCHAR(20),
    PRIMARY KEY (mtgID, color),
    FOREIGN KEY (mtgID) REFERENCES mtg_card(mtgID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mtg_color_identity (
    mtgID VARCHAR(100),
    color VARCHAR(20),
    PRIMARY KEY (mtgID, color),
    FOREIGN KEY (mtgID) REFERENCES mtg_card(mtgID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mtg_supertype (
    mtgID VARCHAR(100),
    supertype VARCHAR(50),
    PRIMARY KEY (mtgID, supertype),
    FOREIGN KEY (mtgID) REFERENCES mtg_card(mtgID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mtg_type (
    mtgID VARCHAR(100),
    card_type VARCHAR(50),
    PRIMARY KEY (mtgID, card_type),
    FOREIGN KEY (mtgID) REFERENCES mtg_card(mtgID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mtg_subtype (
    mtgID VARCHAR(100),
    subtype VARCHAR(50),
    PRIMARY KEY (mtgID, subtype),
    FOREIGN KEY (mtgID) REFERENCES mtg_card(mtgID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mtg_legality (
    mtgID VARCHAR(100),
    card_format VARCHAR(50),
    legality VARCHAR(10),
    PRIMARY KEY (mtgID, card_format),
    FOREIGN KEY (mtgID) REFERENCES mtg_card(mtgID) ON DELETE CASCADE
);

-- =========================================
-- POKÉMON
-- =========================================
create table if not exists pokemon_set (
    set_id varchar(20) primary key,
    name varchar(100),
    series varchar(200)
);


create table if not exists pokemon_card(
    pokID varchar(100) primary key,
    card_name varchar(100),
    card_level varchar(100),
    hp varchar(100),
    evolves_from varchar(100),
    set_id varchar(20),
    card_number varchar(50),
    artist varchar(100),
    rarity varchar(100),
    flavor_text varchar(2000),
    regulation_mark varchar(100),
    supertype varchar(100)
);



create table if not exists pokemon_collection
(
    pokID varchar(100),
    collectionID int,
    PRIMARY KEY (pokID, collectionID),
    FOREIGN KEY (pokID) REFERENCES pokemon_card(pokID) ON DELETE CASCADE,
    FOREIGN KEY (collectionID) REFERENCES collection(collectionID) ON DELETE CASCADE
);



create table if not exists pokemon_subtype(
    pokID varchar(100),
    subtype varchar(100),
    primary key(pokID, subtype),
    foreign key(pokID) references pokemon_card(pokID)
);

create table if not exists pokemon_type(
    pokID varchar(100),
    card_type varchar(100),
    primary key(pokID, card_type),
    foreign key(pokID) references pokemon_card(pokID)
);

create table if not exists pokemon_rules(
    pokID varchar(100),
    rule varchar(500),
    primary key(pokID, rule),
    foreign key(pokID) references pokemon_card(pokID)
);

create table if not exists pokemon_ability(
    pokID varchar(100),
    ability_name varchar(100),
    ability_text varchar(1000),
    ability_type varchar(100),
    primary key(pokID, ability_name),
    foreign key(pokID) references pokemon_card(pokID)
);

create table if not exists pokemon_attack(
    pokID varchar(100),
    attack_name varchar(100),
    damage varchar(100),
    attack_text varchar(1000),
    converted_energy_cost int,
    primary key(pokID, attack_name),
    foreign key(pokID) references pokemon_card(pokID)
);

create table if not exists pokemon_cost(
	pokID varchar(100),
    attack_name varchar(100),
    cost varchar(100),
    primary key(attack_name, cost),
    foreign key(pokID, attack_name) references pokemon_attack(pokID, attack_name)
);

create table if not exists pokemon_weakness(
    pokID varchar(100),
    weak_type varchar(100),
    weak_value varchar(100),
    primary key(pokID, weak_type),
    foreign key(pokID) references pokemon_card(pokID)
);

create table if not exists pokemon_resistance(
    pokID varchar(100),
    resist_type varchar(100),
    resist_value varchar(100),
    primary key(pokID, resist_type),
    foreign key(pokID) references pokemon_card(pokID)
);

create table if not exists pokemon_retreat_cost(
    pokID varchar(100),
    cost varchar(100),
    count int auto_increment primary key,
    foreign key(pokID) references pokemon_card(pokID)
);

create table if not exists pokemon_pokedex_number(
    pokID varchar(100),
    pokedex_number int,
    primary key(pokID, pokedex_number),
    foreign key(pokID) references pokemon_card(pokID)
);

create table if not exists pokemon_legality(
    pokID varchar(100),
    card_format varchar(100),
    legality varchar(100),
	count int auto_increment primary key,
    foreign key(pokID) references pokemon_card(pokID)
);

create table if not exists pokemon_image(
    pokID varchar(100),
    small_img varchar(200),
    large_img varchar(200),
    primary key(pokID),
    foreign key(pokID) references pokemon_card(pokID)
);

create table if not exists pokemon_evolves_to(
	pokID varchar(100),
    name varchar(300),
    primary key(pokID, name),
	foreign key(pokID) references pokemon_card(pokID)
    );