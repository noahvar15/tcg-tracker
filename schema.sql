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
    flavor_text VARCHAR(200),
    artist VARCHAR(50),
    card_number VARCHAR(20),
    power VARCHAR(2),
    toughness VARCHAR(2),
    loyalty VARCHAR(2),
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
CREATE TABLE IF NOT EXISTS pokemon_set (
    set_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100),
    series VARCHAR(100),
    printed_total INT,
    total INT,
    legality_unlimited VARCHAR(50),
    legality_standard VARCHAR(50),
    legality_expanded VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS pokemon_card (
    pokID VARCHAR(100) PRIMARY KEY,
    card_name VARCHAR(100),
    card_level VARCHAR(100),
    hp VARCHAR(100),
    evolves_from VARCHAR(100),
    evolves_to VARCHAR(100),
    converted_energy_cost INT,
    set_id VARCHAR(20),
    card_number VARCHAR(6),
    variant VARCHAR(100),
    artist VARCHAR(100),
    rarity VARCHAR(100),
    flavor_text VARCHAR(100),
    regulation_mark VARCHAR(100),
    FOREIGN KEY (set_id) REFERENCES pokemon_set(set_id)
);

CREATE TABLE IF NOT EXISTS pokemon_collection (
    pokID VARCHAR(100),
    collectionID INT,
    PRIMARY KEY (pokID, collectionID),
    FOREIGN KEY (pokID) REFERENCES pokemon_card(pokID) ON DELETE CASCADE,
    FOREIGN KEY (collectionID) REFERENCES collection(collectionID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pokemon_subtype (
    pokID VARCHAR(100),
    subtype VARCHAR(100),
    PRIMARY KEY (pokID, subtype),
    FOREIGN KEY (pokID) REFERENCES pokemon_card(pokID)
);

CREATE TABLE IF NOT EXISTS pokemon_type (
    pokID VARCHAR(100),
    card_type VARCHAR(100),
    PRIMARY KEY (pokID, card_type),
    FOREIGN KEY (pokID) REFERENCES pokemon_card(pokID)
);

CREATE TABLE IF NOT EXISTS pokemon_rules (
    pokID VARCHAR(100),
    rule VARCHAR(500),
    PRIMARY KEY (pokID, rule),
    FOREIGN KEY (pokID) REFERENCES pokemon_card(pokID)
);

CREATE TABLE IF NOT EXISTS pokemon_ability (
    pokID VARCHAR(100),
    ability_name VARCHAR(100),
    ability_text VARCHAR(1000),
    ability_type VARCHAR(100),
    PRIMARY KEY (pokID, ability_name),
    FOREIGN KEY (pokID) REFERENCES pokemon_card(pokID)
);

CREATE TABLE IF NOT EXISTS pokemon_attack (
    pokID VARCHAR(100),
    attack_name VARCHAR(100),
    damage VARCHAR(100),
    attack_text VARCHAR(1000),
    converted_energy_cost INT,
    PRIMARY KEY (pokID, attack_name),
    FOREIGN KEY (pokID) REFERENCES pokemon_card(pokID)
);

CREATE TABLE IF NOT EXISTS pokemon_cost (
    pokID VARCHAR(100),
    attack_name VARCHAR(100),
    cost VARCHAR(100),
    PRIMARY KEY (attack_name, cost),
    FOREIGN KEY (pokID, attack_name) REFERENCES pokemon_attack(pokID, attack_name)
);

CREATE TABLE IF NOT EXISTS pokemon_weakness (
    pokID VARCHAR(100),
    weak_type VARCHAR(100),
    weak_value VARCHAR(100),
    PRIMARY KEY (pokID, weak_type),
    FOREIGN KEY (pokID) REFERENCES pokemon_card(pokID)
);

CREATE TABLE IF NOT EXISTS pokemon_resistance (
    pokID VARCHAR(100),
    resist_type VARCHAR(100),
    resist_value VARCHAR(100),
    PRIMARY KEY (pokID, resist_type),
    FOREIGN KEY (pokID) REFERENCES pokemon_card(pokID)
);

CREATE TABLE IF NOT EXISTS pokemon_retreat_cost (
    pokID VARCHAR(100),
    cost VARCHAR(100),
    PRIMARY KEY (pokID, cost),
    FOREIGN KEY (pokID) REFERENCES pokemon_card(pokID)
);

CREATE TABLE IF NOT EXISTS pokemon_pokedex_number (
    pokID VARCHAR(100),
    pokedex_number INT,
    PRIMARY KEY (pokID, pokedex_number),
    FOREIGN KEY (pokID) REFERENCES pokemon_card(pokID)
);

CREATE TABLE IF NOT EXISTS pokemon_legality (
    pokID VARCHAR(100),
    card_format VARCHAR(100),
    legality VARCHAR(100),
    PRIMARY KEY (pokID, card_format),
    FOREIGN KEY (pokID) REFERENCES pokemon_card(pokID)
);

CREATE TABLE IF NOT EXISTS pokemon_image (
    pokID VARCHAR(100),
    small_img VARCHAR(200),
    large_img VARCHAR(200),
    PRIMARY KEY (pokID),
    FOREIGN KEY (pokID) REFERENCES pokemon_card(pokID)
);

-- =========================================
-- YU-GI-OH
-- =========================================

create table yugioh_cards
(
    card_id int primary key,
    name varchar(255) not null,
    type varchar(100),
    frame_type varchar(50),
    description text,
    atk int,
    def int,
    level int,
    race varchar(100),
    attribute varchar(50),
    link_val int,
    pendulum_scale int,
    has_effect boolean,
    konami_id int,
    tcg_date date,
    ocg_date date
);

create table yugioh_card_link_markers
(
    marker_id int identity(1,1) primary key,
    card_id int not null,
    marker_position varchar(50) not null,
    foreign key (card_id) references yugioh_cards(card_id)
);

create table yugioh_card_sets
(
    set_id int identity(1,1) primary key,
    card_id int not null,
    set_name varchar(255),
    set_code varchar(50),
    set_rarity varchar(100),
    set_rarity_code varchar(20),
    set_price decimal(10, 2),
    foreign key (card_id) references yugioh_cards(card_id)
);

create table yugioh_card_images
(
    image_id int identity(1,1) primary key,
    card_id int not null,
    image_url varchar(500),
    image_url_small varchar(500),
    image_url_cropped varchar(500),
    foreign key (card_id) references yugioh_cards(card_id)
);

create table yugioh_card_formats
(
    format_id int identity(1,1) primary key,
    card_id int not null,
    format_name varchar(100),
    foreign key (card_id) references yugioh_cards(card_id)
);

create table yugioh_card_archetypes
(
    archetype_id int identity(1,1) primary key,
    card_id int not null,
    archetype_name varchar(255),
    foreign key (card_id) references yugioh_cards(card_id)
);

