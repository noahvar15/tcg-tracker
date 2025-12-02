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