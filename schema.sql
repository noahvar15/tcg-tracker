create schema
if not exists tcg_tracker;
use tcg_tracker;

create table
if not exists user
(
    uID INT AUTO_INCREMENT PRIMARY KEY,
    first_name varchar
(30),
    middle_initial char
(1),
    last_name varchar
(30),
    email varchar
(50) UNIQUE,
    dob DATE,
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table
if not exists collection
(
    uID INT,
    collectionID INT AUTO_INCREMENT PRIMARY KEY,
    collection_name VARCHAR
(100),
    descriptor VARCHAR
(250),
    size INT DEFAULT 0,
    FOREIGN KEY
(uID) REFERENCES user
(uID) ON
DELETE CASCADE
);

-- -- -- -- -- -- -- -- -- -- -- -- 
-- -- -- -- -- MTG -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- 

create table
if not exists mtg_card
(
    mtgID varchar
(100) PRIMARY KEY,
    name VARCHAR
(100),
    layout VARCHAR
(100),
    cmc INT,
    rarity VARCHAR
(100),
    set_code VARCHAR
(100),
    set_name VARCHAR
(100),
    card_text VARCHAR
(1000),
    flavor_text VARCHAR
(200),
    artist VARCHAR
(50),
    card_number VARCHAR
(20),
    power VARCHAR
(2),
    toughness VARCHAR
(2),
    loyalty VARCHAR
(2),
    mana_cost VARCHAR
(100),
    image VARCHAR
(200)
);

create table
if not exists mtg_collection
(
    mtgID varchar
(100),
    collectionID INT,
    PRIMARY KEY
(mtgID, collectionID),
    FOREIGN KEY
(mtgID) REFERENCES mtg_card
(mtgID) ON
DELETE CASCADE,
    FOREIGN KEY (collectionID)
REFERENCES collection
(collectionID) ON
DELETE CASCADE
);

create table
if not exists mtg_color
(
    mtgID varchar
(100),
    color VARCHAR
(20),
    PRIMARY KEY
(mtgID, color),
    FOREIGN KEY
(mtgID) REFERENCES mtg_card
(mtgID) ON
DELETE CASCADE
);

create table
if not exists mtg_color_identity
(
    mtgID varchar
(100),
    color VARCHAR
(20),
    PRIMARY KEY
(mtgID, color),
    FOREIGN KEY
(mtgID) REFERENCES mtg_card
(mtgID) ON
DELETE CASCADE
);

create table
if not exists mtg_supertype
(
    mtgID varchar
(100),
    supertype VARCHAR
(50),
    PRIMARY KEY
(mtgID, supertype),
    FOREIGN KEY
(mtgID) REFERENCES mtg_card
(mtgID) ON
DELETE CASCADE
);

create table
if not exists mtg_type
(
    mtgID varchar
(100),
    card_type VARCHAR
(50),
    PRIMARY KEY
(mtgID, card_type),
    FOREIGN KEY
(mtgID) REFERENCES mtg_card
(mtgID) ON
DELETE CASCADE
);

create table
if not exists mtg_subtype
(
    mtgID varchar
(100),
    subtype VARCHAR
(50),
    PRIMARY KEY
(mtgID, subtype),
    FOREIGN KEY
(mtgID) REFERENCES mtg_card
(mtgID) ON
DELETE CASCADE
);

create table
if not exists mtg_legality
(
    mtgID varchar
(100),
    card_format VARCHAR
(50),
    legality VARCHAR
(10),
    PRIMARY KEY
(mtgID, card_format),
    FOREIGN KEY
(mtgID) REFERENCES mtg_card
(mtgID) ON
DELETE CASCADE
);

CREATE TABLE variations
(
    mtgID varchar(100),
    variation_id varchar(100),
    FOREIGN KEY (mtgID) REFERENCES mtg_card(mtgID) ON DELETE CASCADE
);

-- -- -- -- -- -- -- -- -- -- -- -- 
-- -- -- -- -- POK -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- 

create table
if not exists pokemon_set
(
    set_id varchar
(20) primary key,
    name varchar
(100),
    series varchar
(100),
    printed_total int,
    total int,
    legality_unlimited varchar
(50),
    legality_standard varchar
(50),
    legality_expanded varchar
(50)
);

create table
if not exists pokemon_card
(
    pokID varchar
(100) primary key,
    card_name varchar
(100),
    card_level varchar
(100),
    hp varchar
(100),
    evolves_from varchar
(100),
    evolves_to varchar
(100),
    converted_energy_cost int,
    set_id varchar
(20),
    card_number varchar
(6),
    variant varchar
(100),
    artist varchar
(100),
    rarity varchar
(100),
    flavor_text varchar
(100),
    regulation_mark varchar
(100),
    foreign key
(set_id) references pokemon_set
(set_id)
);

create table
if not exists pokemon_collection
(
    pokID varchar
(100),
    collectionID int,
    PRIMARY KEY
(pokID, collectionID),
    FOREIGN KEY
(pokID) REFERENCES pokemon_card
(pokID) ON
DELETE CASCADE,
    FOREIGN KEY (collectionID)
REFERENCES collection
(collectionID) ON
DELETE CASCADE
);

create table
if not exists pokemon_subtype
(
    pokID varchar
(100),
    subtype varchar
(100),
    primary key
(pokID, subtype),
    foreign key
(pokID) references pokemon_card
(pokID)
);

create table
if not exists pokemon_type
(
    pokID varchar
(100),
    card_type varchar
(100),
    primary key
(pokID, card_type),
    foreign key
(pokID) references pokemon_card
(pokID)
);

create table
if not exists pokemon_rules
(
    pokID varchar
(100),
    rule varchar
(500),
    primary key
(pokID, rule),
    foreign key
(pokID) references pokemon_card
(pokID)
);

create table
if not exists pokemon_ability
(
    pokID varchar
(100),
    ability_name varchar
(100),
    ability_text varchar
(1000),
    ability_type varchar
(100),
    primary key
(pokID, ability_name),
    foreign key
(pokID) references pokemon_card
(pokID)
);

create table
if not exists pokemon_attack
(
    pokID varchar
(100),
    attack_name varchar
(100),
    damage varchar
(100),
    attack_text varchar
(1000),
    converted_energy_cost int,
    primary key
(pokID, attack_name),
    foreign key
(pokID) references pokemon_card
(pokID)
);

create table
if not exists pokemon_cost
(
	pokID varchar
(100),
    attack_name varchar
(100),
    cost varchar
(100),
    primary key
(attack_name, cost),
    foreign key
(pokID, attack_name) references pokemon_attack
(pokID, attack_name)
);

create table
if not exists pokemon_weakness
(
    pokID varchar
(100),
    weak_type varchar
(100),
    weak_value varchar
(100),
    primary key
(pokID, weak_type),
    foreign key
(pokID) references pokemon_card
(pokID)
);

create table
if not exists pokemon_resistance
(
    pokID varchar
(100),
    resist_type varchar
(100),
    resist_value varchar
(100),
    primary key
(pokID, resist_type),
    foreign key
(pokID) references pokemon_card
(pokID)
);

create table
if not exists pokemon_retreat_cost
(
    pokID varchar
(100),
    cost varchar
(100),
    primary key
(pokID, cost),
    foreign key
(pokID) references pokemon_card
(pokID)
);

create table
if not exists pokemon_pokedex_number
(
    pokID varchar
(100),
    pokedex_number int,
    primary key
(pokID, pokedex_number),
    foreign key
(pokID) references pokemon_card
(pokID)
);

create table
if not exists pokemon_legality
(
    pokID varchar
(100),
    card_format varchar
(100),
    legality varchar
(100),
    primary key
(pokID, card_format),
    foreign key
(pokID) references pokemon_card
(pokID)
);

create table
if not exists pokemon_image
(
    pokID varchar
(100),
    small_img varchar
(200),
    large_img varchar
(200),
    primary key
(pokID),
    foreign key
(pokID) references pokemon_card
(pokID)
);

-------------------------
-----------YUG-----------
-------------------------

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

