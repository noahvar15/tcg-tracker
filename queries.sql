drop table user;
drop view collection_with_size;

CREATE TABLE IF NOT EXISTS user (
    uID INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    middle_initial CHAR(1),
    last_name VARCHAR(30),
    email VARCHAR(50) UNIQUE,
    dob DATE,
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- #1, #3b


insert into user (first_name, middle_initial, last_name, email, dob) values
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
    ("BetterNoah",
    "L",
    "BetterVargas",
    "better_n_var@email.com",
    "2004-05-22"),
    ("Josh",
    "M",
    "Perriera",
    "jp511@email.com",
    "2004-05-12");
-- #2

select * from user;

-- #5

alter table collection
rename column descriptor to c_description;

select c_description from collection;

-- #6

insert into collection (uID, collection_name, c_description, size) values(
	1,
    "Manny's Super Cool Colleccion",
    "Doesn't get better than this.",
    100
),(
	2,
    "Noah's Wack Ahh Colleccion",
    "Doesn't get worse than this.",
    1
),(
	3,
    "Demon TCG Colleccion",
    "It's better than noah's fasho.",
    5
),(
	4,
    "JP W Book",
    "Doesn't get better than this.",
    100
);

-- #7
insert into mtg_collection values
("000e097b-ff5f-5a34-b4fc-a1c76e899e4f", 1),
("002a5e44-81f2-596e-9b3d-bf8a4981df78", 1),
("007d2f21-f6a3-5f65-9600-c2a5fa35ae36", 1),
("00886106-45ee-5261-9436-885ba86a155e", 1),
("00957a2e-4309-52c7-9b8e-9931f7c304e6", 1);

insert into mtg_collection values
("00a587d6-64e2-55c5-9a40-fb6401596632", 2),
("00aded64-a558-5945-8909-6134d1172cc9", 2),
("007d2f21-f6a3-5f65-9600-c2a5fa35ae36", 2),
("00b588b6-ce9e-5c09-9ec4-eaefe0f92918", 2),
("000e097b-ff5f-5a34-b4fc-a1c76e899e4f", 2),
("00957a2e-4309-52c7-9b8e-9931f7c304e6", 2),
("00dad494-511c-5202-ae75-f53afe6f6b13", 2);

insert into mtg_collection values
("00f8f397-9d44-5d5e-ba25-a57a2533e153", 3),
("00aded64-a558-5945-8909-6134d1172cc9", 3),
("0109faa4-6e05-5c3f-b2fc-d8d71fa9e42a", 3),
("010ca5c3-0ec0-5ee7-a012-dfdd964bdee2", 3),
("011d5341-39b1-5b98-b0fb-43c72aca6b4a", 3),
("011ed5e4-d86e-5430-84a6-6f7fa5b20586", 3),
("00dad494-511c-5202-ae75-f53afe6f6b13", 3);

insert into mtg_collection values
("011ccfdb-3149-52a6-b57e-9720ab1b3d87", 4),
("0115b361-604d-5e3f-a0e3-0464eeacd4c3", 4),
("01013cab-be73-532f-b6bf-0f24d0c3792f", 4),
("01248698-729b-5a69-ba8c-f1686a181abb", 4),
("0131c33e-6cb8-53f7-911e-a2c82b8fc8b5", 4),
("011ed5e4-d86e-5430-84a6-6f7fa5b20586", 4),
("01490ea5-eac1-5be1-b95f-e1af9f2c0f85", 4);


-- #8
-- cards both user 1 and user 2 both have in collection
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


-- counting most owned cards

select 
    m.name as card_name,
    count(mc.collectionID) as total_owned
from mtg_card m
join mtg_collection mc 
    on m.mtgID = mc.mtgID
group by m.name
order by total_owned desc;


-- Viewing all user's collection
select 
    c.collectionID,
    m.name as card_name
from mtg_collection c
join mtg_card m 
    on c.mtgID = m.mtgID;



-- #9

-- 
-- Create View of Collection size
--
CREATE VIEW collection_with_size AS
SELECT c.collectionID,
       c.collection_name,
       COUNT(mc.mtgID) AS collection_size
FROM collection c
LEFT JOIN mtg_collection mc ON c.collectionID = mc.collectionID
GROUP BY c.collectionID;


SELECT * FROM collection_with_size;