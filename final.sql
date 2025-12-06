-- =========================================
-- CREATING DATABASE
-- =========================================


create database if not exists tcg_tracker;

use tcg_tracker;
  
GRANT ALL PRIVILEGES ON tcg_tracker.* TO 'test'@'localhost';



create table if not exists user
(
    uID INT AUTO_INCREMENT PRIMARY KEY,
    first_name varchar(30),
    middle_initial char(1),
    last_name varchar(30),
    email varchar(50) UNIQUE,
    dob DATE,
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table if not exists collection
(
    uID INT,
    collectionID INT AUTO_INCREMENT PRIMARY KEY,
    collection_name VARCHAR(100),
    descriptor VARCHAR(250),
    size INT DEFAULT 0,
    FOREIGN KEY(uID) REFERENCES user(uID) ON DELETE CASCADE
);

-- =========================================
-- POKEMON
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
    


-- =========================================
-- MAGIC: THE GATHERING
-- =========================================

drop table mtg_card;
drop table mtg_collection;
drop table mtg_color;
drop table mtg_color_identity;
drop table mtg_supertype;
drop table mtg_type;
drop table mtg_subtype;
drop table mtg_legality;

CREATE TABLE IF NOT EXISTS mtg_card (
    mtgID VARCHAR(100) PRIMARY KEY,
    name VARCHAR(500),
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
    loyalty VARCHAR(10),
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
-- DATA INSERTION (These are pulled from our scripts in python folder)
-- =========================================

-- =========================================
-- pokeset.py (pulls from the Pokemon set API to fill in values)
-- =========================================

INSERT INTO pokemon_set (
    set_id,
    name, 
    series
)
VALUES (%s, %s, %s)

-- =========================================
-- pokescript.py (pulls from the Pokemon card API to fill in values)
-- =========================================

INSERT INTO pokemon_card (
    pokID,
    card_name,
    card_level,
    hp,
    evolves_from,
    set_id,
    card_number,
    artist,
    rarity,
    flavor_text,
    regulation_mark,
    supertype
)
VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)

INSERT INTO pokemon_subtype (
    pokID, subtype
)
VALUES (%s, %s)

INSERT INTO pokemon_type (
    pokID, card_type
)
VALUES (%s, %s)

INSERT INTO pokemon_rules (
    pokID, rule
)
VALUES (%s, %s)

INSERT INTO pokemon_ability (
    pokID, ability_name, ability_text, ability_type
)
VALUES (%s, %s, %s, %s)

INSERT INTO pokemon_attack (
    pokID, attack_name, damage, attack_text, converted_energy_cost
)
VALUES (%s, %s, %s, %s, %s)

INSERT INTO pokemon_cost (
    pokID, attack_name, cost
)
VALUES (%s, %s, %s)

INSERT INTO pokemon_weakness (
    pokID, weak_type, weak_value
)
VALUES (%s, %s, %s)

INSERT INTO pokemon_resistance (
    pokID, resist_type, resist_value
)
VALUES (%s, %s, %s)

INSERT INTO pokemon_retreat_cost (
    pokID, cost
)
VALUES (%s, %s)

INSERT INTO pokemon_pokedex_number (
    pokID, pokedex_number
)
VALUES (%s, %s)

INSERT INTO pokemon_legality (
    pokID, card_format, legality
)
VALUES (%s, %s, %s)

INSERT INTO pokemon_image (
    pokID, small_img, large_img
)
VALUES (%s, %s, %s)

INSERT INTO pokemon_evolves_to (
    pokID, name
)
VALUES (%s, %s)

-- =========================================
-- script.py (pulls from the MTG API to fill in values)
-- =========================================

INSERT INTO mtg_card (
    mtgID, name, layout, cmc, rarity, set_code, set_name, card_type,
    card_text, flavor_text, artist, card_number, power, toughness, loyalty, mana_cost, image
)
VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)

INSERT INTO mtg_color (
    mtgID, color
)
VALUES (%s, %s)

INSERT INTO mtg_color_identity (
    mtgID, color
)
VALUES (%s, %s)

INSERT INTO mtg_supertype (
    mtgID, supertype
)
VALUES (%s, %s)

INSERT INTO mtg_type (
    mtgID, card_type
)
VALUES (%s, %s)

INSERT INTO mtg_subtype (
    mtgID, subtype
)
VALUES (%s, %s)

INSERT INTO mtg_legality (
    mtgID, card_format, legality
)
VALUES (%s, %s, %s)

-- =========================================
-- test queries, views, and indices created
-- =========================================

-- QUERIES --


-- show some tables--
select *
from pokemon_card;
select *
from mtg_card;
select *
from pokemon_type;
select *
from pokemon_set;
select *
from mtg_legality;

-- show many cards in db --
select
    (select count(*)
    from pokemon_card) +
(select count(*)
    from mtg_card) as total_card_count;

-- select charizard cards --

select *
from pokemon_card
where card_name like "charizard%";


-- INSERTS --
insert into user
    (first_name, middle_initial, last_name, email, dob)
values
    ("Manny",
        "",
        "Giron",
        "e_giron@email.com",
        "2004-04-02"),
    ("Noah",
        "L",
        "Vargas",
        "n_var@email.com",
        "2004-04-23"),
    ("Josh",
        "M",
        "Perriera",
        "jmp511@email.com",
        "2004-05-11");
-- CHECK INSERT --

select *
from user;

-- ALTER THE COLLECTION TABLE --

select descriptor
from collection;

alter table collection
rename column descriptor to c_description;

select c_description
from collection;

alter table collection
rename column c_description to descriptor;

-- INSERTS --

insert into collection
    (uID, collection_name, descriptor)
values(
        1,
        "Manny's Collection",
        "Doesn't get better than this."
),
    (
        2,
        "Noah's Collection",
        "First Collection."
),
    (
        3,
        "Josh's Collection",
        "My Collection"
);

-- CHECK INSERTION --
select *
from collection;

-- INSERTIONS --
insert into mtg_collection
values
    ("004adf9a-b59a-5d56-9093-df73b9929bb1", 1),
    ("009c492a-c0e1-5dba-9caa-68e52d73e556", 1),
    ("01603f03-a5ea-53d0-9d9e-14770b97be39", 1),
    ("01e48603-fbf2-5178-92d2-3d6c9944f4b5", 1),
    ("03067da3-4b66-57de-8181-cfdf12f48a9c", 1);

insert into mtg_collection
values
    ("004adf9a-b59a-5d56-9093-df73b9929bb1", 2),
    ("009c492a-c0e1-5dba-9caa-68e52d73e556", 2),
    ("1ad070b0-a4ab-5658-b599-1178c86a379e", 2),
    ("1afcbee1-1310-5144-86ea-e7bf0fb34d2b", 2),
    ("1e1887ca-10b3-569a-87e7-fbdef5b988dc", 2),
    ("21edc41a-e830-58d0-80b5-85eabe32d0d7", 2),
    ("25634111-8644-5d96-9e23-3b00c2ea0ed5", 2);

insert into mtg_collection
values
    ("29debff3-e25e-5940-b194-3ff4db7ae422", 3),
    ("38513fa0-ea83-5642-8ecd-4f0b3daa6768", 3),
    ("3c0f2770-7609-5b8f-89c3-0768d92ca7a3", 3),
    ("41b6098d-f7d9-5a37-9734-01dff7ce4912", 3),
    ("4626c357-a4fc-5941-ad11-6f92a2e8423a", 3),
    ("4ed247e0-386b-5166-9c99-875d6f82f681", 3),
    ("546eac7c-1424-597d-ac13-bf8558e88fe3", 3);

-- CHECK INSERTION --

select *
from mtg_collection
where collectionID = 1;

select *
from mtg_collection
where collectionID = 2;

select *
from mtg_collection
where collectionID = 3;

-- delete user 3 --
delete from user
where uID = 3;

-- show that deletions cascaded --
select *
from user;
select *
from collection;
select *
from mtg_collection;


-- magic cards both user 1 and user 2 both have in collection
SELECT DISTINCT
    a.mtgID,
    m.name AS card_name
FROM mtg_collection a
    INNER JOIN mtg_collection b
    ON a.mtgID = b.mtgID
    JOIN mtg_card m
    ON a.mtgID = m.mtgID
WHERE a.collectionID = 1
    AND b.collectionID = 2;


-- counting most owned magic cards
select
    m.name as card_name,
    count(mc.collectionID) as total_owned
from mtg_card m
    join mtg_collection mc
    on m.mtgID = mc.mtgID
group by m.name
order by total_owned desc;


-- viewing all user's collection
select
    c.collectionID,
    m.name as card_name
from mtg_collection c
    join mtg_card m
    on c.mtgID = m.mtgID;

-- create View of Collection size
create definer='test'@'localhost' view collection_with_size as
select c.collectionID,
    c.collection_name,
    COUNT(mc.mtgID) as collection_size
from collection c
    left join mtg_collection mc on c.collectionID = mc.collectionID
group by c.collectionID;



-- show view --
select *
from collection_with_size;

-- drop view --

drop view if exists collection_with_size;


-- cleaning up --
drop table mtg_collection;
drop table pokemon_collection;
drop table collection;
drop table user;

select *
from pokemon_collection;

select *
from collection;

select *
from mtg_collection;

select *
from user;

-- 
-- MANNYS ADDITIONS
-- \/ \/     \/ \/
ALTER TABLE user
ADD password_hash VARCHAR(255) NOT NULL;

-- 
-- Create View of Most Owned Cards
--
CREATE VIEW most_owned_cards
AS
    select
        m.name as card_name,
        m.mtgID as card_ID,
        m.image as card_image,
        count(mc.collectionID) as total_owned
    from mtg_card m
        join mtg_collection mc
        on m.mtgID = mc.mtgID
    group by m.name, m.mtgID, m.image
    order by total_owned desc;

--
SELECT *
FROM most_owned_cards;


-- Adding for user 

ALTER TABLE user
ADD password_hash VARCHAR(255) NOT NULL;

-- IF ^ DOESNT WANNA RUN, drop user table and add the column directly instead of altering


CREATE OR REPLACE VIEW view_mtg_ui AS
SELECT
    mtgID AS id,
    name,
    image,
    card_number
FROM mtg_card;


select *
from view_mtg_ui;

CREATE OR REPLACE VIEW view_pokemon_ui AS
SELECT
    pc.pokID AS id,
    pc.card_name AS name,
    pc.card_number,
    pi.small_img AS image
FROM pokemon_card pc
    LEFT JOIN pokemon_image pi ON pc.pokID = pi.pokID;


CREATE OR REPLACE VIEW view_pokemon_ui AS
SELECT
    pc.pokID AS id,
    pc.card_name AS name,
    pc.card_number,
    pi.small_img AS image
FROM pokemon_card pc
    LEFT JOIN pokemon_image pi ON pc.pokID = pi.pokID;



CREATE OR REPLACE VIEW view_user_collections AS
SELECT
    c.collectionID,
    c.uID,
    c.collection_name,
    c.descriptor,
    c.size
FROM collection c;


-- 
CREATE OR REPLACE VIEW view_collection_pokemon_cards AS
SELECT
    c.collectionID,
    'pokemon' AS type,
    c.pokID AS id,
    p.card_name AS name,
    pi.small_img AS image,
    p.card_number
FROM pokemon_collection c
    JOIN pokemon_card p ON c.pokID = p.pokID
    LEFT JOIN pokemon_image pi ON p.pokID = pi.pokID;

select *
from view_collection_pokemon_cards;


CREATE OR REPLACE VIEW view_collection_all_cards AS
    SELECT
        c.collectionID,
        'mtg' AS type,
        c.mtgID AS id,
        m.name,
        m.image AS image,
        m.card_number
    FROM mtg_collection c
        JOIN mtg_card m ON c.mtgID = m.mtgID

UNION ALL

    SELECT
        c.collectionID,
        'pokemon' AS type,
        c.pokID AS id,
        p.card_name AS name,
        pi.small_img AS image,
        p.card_number
    FROM pokemon_collection c
        JOIN pokemon_card p ON c.pokID = p.pokID
        LEFT JOIN pokemon_image pi ON p.pokID = pi.pokID;


SELECT *
FROM view_collection_all_cards
WHERE collectionID = %s;


create index idx_card_name_pkmn on pokemon_card(card_name);
create index idx_card_name_mtg on mtg_card(name);

-- Fill With your username (root most likely)
GRANT ALL PRIVILEGES ON *.* TO 'username'@'host';
FLUSH PRIVILEGES;

-- =========================================
-- routes.py contains queries that website uses.
-- (This file is found in website\backend\routes.py) 
-- =========================================

SELECT card_name AS name, small_img AS image, 'pokemon' AS type, pokID AS id
        FROM pokemon_card
        JOIN pokemon_image USING (pokID)
        WHERE small_img IS NOT NULL AND card_name LIKE %s

        UNION ALL

        SELECT name, image, 'mtg' AS type, mtgID AS id
        FROM mtg_card
        WHERE image IS NOT NULL AND name LIKE %s;

SELECT mtgID as id, name, image, 'mtg' as type 
        FROM mtg_card
        WHERE set_code = %s

SELECT * FROM pokemon_set WHERE set_id = %s

SELECT c.pokID as id, 'pokemon' as type, c.card_name, i.small_img, i.large_img 
        FROM pokemon_card c 
        LEFT JOIN pokemon_image i ON c.pokID = i.pokID 
        WHERE c.set_id = %s;

SELECT * FROM mtg_card WHERE mtgID = %s

SELECT pc.*, pi.small_img, pi.large_img
        FROM pokemon_card pc
        LEFT JOIN pokemon_image pi ON pc.pokID = pi.pokID
        WHERE pc.pokID = %s

SELECT 
        (SELECT count(*)
        from pokemon_card) +
        (SELECT count(*)
        from mtg_card) as total_card_count;

SELECT * FROM view_user_collections WHERE uID = %s;

SELECT type as card_type, id, name, image, card_number
        FROM view_collection_all_cards
        WHERE collectionID = %s

DELETE FROM mtg_collection WHERE mtgID = %s AND collectionID = %s

DELETE FROM pokemon_collection WHERE pokID = %s AND collectionID = %s

UPDATE collection SET size = GREATEST(size - 1, 0) WHERE collectionID = %s

INSERT IGNORE INTO mtg_collection (mtgID, collectionID) VALUES (%s, %s)

INSERT IGNORE INTO pokemon_collection (pokID, collectionID) VALUES (%s, %s)

UPDATE collection SET size = size + 1 WHERE collectionID = %s

INSERT INTO collection (uID, collection_name, descriptor)
        VALUES (%s, %s, %s)

INSERT INTO user (first_name, middle_initial, last_name, email, DOB, password_hash)
        VALUES (%s, %s, %s, %s, %s, %s)

SELECT * FROM user WHERE email = %s

SELECT  uID, first_name, last_name, email, DOB from user where uID = %s

UPDATE collection
            SET collection_name = %s
            WHERE collectionID = %s AND uID = %s

DELETE FROM collection WHERE collectionID = %s AND uID = %s