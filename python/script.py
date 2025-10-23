import requests
import mysql.connector
import time

# Establish connection with db
mydb = mysql.connector.connect(
    host="localhost",
    user="test",
    passwd="test",
    database="tcg_tracker"
)

# create cursor
mycursor = mydb.cursor()

def insert_data(cursor, sql, values):
    try:
        cursor.execute(sql, values)
    except mysql.connector.Error as err:
        print(f"Error inserting data: {err}")

# sql commands
mtg_card_sql = """
INSERT INTO mtg_card (
    mtgID, name, layout, cmc, rarity, set_code, set_name, card_type,
    card_text, flavor_text, artist, card_number, power, toughness, loyalty, mana_cost, image
)
VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
"""

mtg_color_sql = """
INSERT INTO mtg_color (
    mtgID, color
)
VALUES (%s, %s)
"""

mtg_color_identity_sql = """
INSERT INTO mtg_color_identity (
    mtgID, color
)
VALUES (%s, %s)
"""

mtg_supertype_sql = """
INSERT INTO mtg_supertype (
    mtgID, supertype
)
VALUES (%s, %s)
"""

mtg_type_sql = """
INSERT INTO mtg_type (
    mtgID, card_type
)
VALUES (%s, %s)
"""

mtg_subtype_sql = """
INSERT INTO mtg_subtype (
    mtgID, subtype
)
VALUES (%s, %s)
"""

mtg_legality_sql = """
INSERT INTO mtg_legality (
    mtgID, card_format, legality
)
VALUES (%s, %s, %s)
"""

# more sql commands go below here

page = 1
base_url = "https://api.magicthegathering.io/v1/cards?pageSize=100&page="
requests_made = 0

while True:
#while page <= 1:
    url = f"{base_url}{page}"
    response = requests.get(url)
    requests_made += 1

    if response.status_code != 200:
            print(f"Failed on page {page}: {response.status_code}")
            break
    
    data = response.json()
    cards = data.get('cards', [])
    if not cards:
            print('No more cards. Stopping.')
            break

    for card in data['cards']:
        values = (
            card.get('id'),
            card.get('name'),
            card.get('layout'),
            card.get('cmc'),
            card.get('rarity'),
            card.get('set'),
            card.get('setName'),
            card.get('type'),
            card.get('text'),
            card.get('flavor'),
            card.get('artist'),
            card.get('number'),
            card.get('power'),
            card.get('toughness'),
            card.get('loyalty'),
            card.get('manaCost'),
            card.get('imageUrl'),
        )
        insert_data(mycursor, mtg_card_sql, values)

        mydb.commit()    
        
        if 'colors' in card and card['colors']:
            for color in card['colors']:
                insert_data(mycursor, mtg_color_sql, (card.get('id'), color))

        if 'colorIdentity' in card and card['colorIdentity']:
            for color in card['colorIdentity']:
                insert_data(mycursor, mtg_color_identity_sql, (card.get('id'), color))

        if 'supertypes' in card and card['supertypes']:
            for supertype in card['supertypes']:
                insert_data(mycursor, mtg_supertype_sql, (card.get('id'), supertype))

        if 'types' in card and card['types']:
            for type in card['types']:
                insert_data(mycursor, mtg_type_sql, (card.get('id'), type))
        
        if 'subtypes' in card and card['subtypes']:
            for subtype in card['subtypes']:
                insert_data(mycursor, mtg_subtype_sql, (card.get('id'), subtype))

        if 'legalities' in card and card['legalities']:
           for legality_entry in card['legalities']:
               insert_data(mycursor, mtg_legality_sql, (card.get('id'), legality_entry.get('format'), legality_entry.get('legality')))

        # more insertions go below here

    mydb.commit()
    print(f"Inserted page {page} ({len(cards)} cards)")

    time.sleep(0.5)

    if requests_made >= 5000:
         print("Hit 5000 requests, sleeping for 1 hour")
         time.sleep(3600)
         requests_made = 0

    page += 1

print('All cards inserted')