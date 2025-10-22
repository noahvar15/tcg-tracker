import requests
import mysql.connector
import time

# Establish connection with db
mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    passwd="root",
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
    mtgID, name, layout, cmc, rarity, set_code, set_name,
    card_text, flavor_text, artist, card_number, power, toughness, loyalty, mana_cost, image
)
VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
"""

# more sql commands go below here

page = 1
base_url = "https://api.magicthegathering.io/v1/cards?pageSize=100&page="
requests_made = 0

while True:
    url = f"{base_url}{page}"
    response = requests.get(url)
    requests_made += 1

    if response.status_code != 200:
            print(f"Failed on page {page}: {response.status_code}")
            break
    
    data = response.json()
    cards = data.get('cards', [])
    if not card:
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