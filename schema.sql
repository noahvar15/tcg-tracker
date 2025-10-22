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

-------------------------
-----------MTG-----------
-------------------------

create table mtg_card
(
    mtgID INT PRIMARY KEY,
    name VARCHAR(100),
    layout VARCHAR(100),
    cmc INT,
    rarity VARCHAR(100),
    set_code VARCHAR(100),
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

create table mtg_collection
(
    mtgID INT,
    collectionID INT,
    PRIMARY KEY (mtgID, collectionID),
    FOREIGN KEY (mtgID) REFERENCES mtg_card(mtgID) ON DELETE CASCADE,
    FOREIGN KEY (collectionID) REFERENCES collection(collectionID) ON DELETE CASCADE
);

create table mtg_color
(
    mtgID INT,
    color VARCHAR(20),
    PRIMARY KEY(mtgID, color),
    FOREIGN KEY(mtgID) REFERENCES mtg_card(mtgID)
);

create table mtg_color_identity
(
    mtgID INT,
    color VARCHAR(20),
    PRIMARY KEY(mtgID, color),
    FOREIGN KEY(mtgID) REFERENCES mtg_card(mtgID)
);

create table mtg_supertype
(
    mtgID INT,
    supertype VARCHAR(50),
    PRIMARY KEY(mtgID, supertype),
    FOREIGN KEY(mtgID) REFERENCES mtg_card(mtgID)
);

create table mtg_type
(
    mtgID INT,
    card_type VARCHAR(50),
    PRIMARY KEY(mtgID, type),
    FOREIGN KEY(mtgID) REFERENCES mtg_card(mtgID)
);

create table mtg_subtype
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

create table mtg_name
(
    mtgID INT,
    name VARCHAR(50),
    PRIMARY KEY(mtgID, name),
    FOREIGN KEY(mtgID) REFERENCES mtg_card(mtgID)
);

-------------------------
-----------POK-----------
-------------------------

create table pokemon_card(
    pokID varchar(100) primary key,
    name varchar(100),
    card_level varchar(100),
    hp varchar(100),
    evolves_from varchar(100),
    evolves_to varchar(100),
    converted_energy_cost int,
    set_code hash,
    number varchar(6),
    variant varchar(100),
    artist varchar(100),
    rarity varchar(100),
    flavor_text varchar(100),
    regulation_mark varchar(100),
)

create table pokemon_collection
(
    pokID varchar(100),
    collectionID int,
    PRIMARY KEY (pokID, collectionID),
    FOREIGN KEY (pokID) REFERENCES pokemon_card(pokID) ON DELETE CASCADE,
    FOREIGN KEY (collectionID) REFERENCES collection(collectionID) ON DELETE CASCADE
);

create table pokemon_subtype(
    pokID varchar(100),
    subtype varchar(100),
    primary key(pokID, subtype),
    foreign key(pokID) references pokemon_card(pokID)
)

create table pokemon_type(
    pokID varchar(100),
    card_type varchar(100),
    primary key(pokID, type),
    foreign key(pokID) references pokemon_card(pokID)
)

create table pokemon_rules(
    pokID varchar(100),
    rule varchar(500),
    primary key(pokID, rules),
    foreign key(pokID) references pokemon_card(pokID)
)

create table pokemon_ability(
    pokeID varchar(100),
    ability_name varchar(100),
    ability_text varchar(1000),
    ability_type varchar(100),
    primary key(pokID, ability_name),
)

create table pokemon_cost(
    attack_name varchar(100),
    cost varchar(100),
    primary key(attack_name, cost)
    foreign key(attack_name) references pokemon_attacks(attack_name)
)

create table pokemon_attack(
    pokID varchar(100),
    attack_name varchar(100),
    damage varchar(100),
    attack_text varchar(1000),
    converted_energy_cost int,
    primary key(pokID, attack_name),
    foreign key(pokID) references pokemon_card(pokID)
)

create table pokemon_weakness(
    pokID varchar(100),
    weak_type varchar(100),
    weak_value varchar(100),
    primary key(pokID, type),
    foreign key(pokID) references pokemon_card(pokID)
)

create table pokemon_resistance(
    pokID varchar(100),
    resist_type varchar(100),
    resist_value varchar(100),
    primary key(pokID, type),
    foreign key(pokID) references pokemon_card(pokID)
)

create table pokemon_retreat_cost(
    pokID varchar(100),
    cost varchar(100),
    primary key(pokID, cost),
    foreign key(pokID) references pokemon_card(pokID)
)

create table pokemon_pokedex_number(
    pokID varchar(100),
    pokedex_number int,
    primary key(pokID, pokedex_number),
    foreign key(pokID) references pokemon_card(pokID)
)

create table pokemon_legality(
    standard varchar(100),
    expanded varchar(100),
    unlimited varchar(100),
    primary key(pokID, format),
    foreign key(pokID) references pokemon_card(pokID)
)

create table pokemon_image(
    pokID varchar(100),
    small_img varchar(200),
    large_img varchar(200),
    primary key(pokID),
    foreign key(pokID) references pokemon_card(pokID)
)

-------------------------
-----------LOR-----------
-------------------------