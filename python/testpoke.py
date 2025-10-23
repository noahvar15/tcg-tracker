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
pokemon_card_sql = """
INSERT INTO pokemon_card (
    pokID,
    card_name,
    card_level,
    hp,
    evolves_from,
    evolves_to,
    set_id,
    card_number,
    artist,
    rarity,
    flavor_text,
    regulation_mark,
    supertype
)
VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
"""


pokemon_set_sql = """
INSERT INTO pokemon_set (
    set_id, name, series
)
VALUES (%s, %s, %s)
"""

pokemon_subtype_sql = """
INSERT INTO pokemon_subtype (
    pokID, subtype
)
VALUES (%s, %s)
"""

pokemon_type_sql = """
INSERT INTO pokemon_type (
    pokID, card_type
)
VALUES (%s, %s)
"""

pokemon_rules = """
INSERT INTO pokemon_rules (
    pokID, rule
)
VALUES (%s, %s)
"""

pokemon_ability_sql = """
INSERT INTO pokemon_ability (
    pokID, ability_name, ability_text, ability_type
)
VALUES (%s, %s, %s, %s)
"""

pokemon_attack_sql = """
INSERT INTO pokemon_attack (
    pokID, attack_name, damage, attack_text, converted_energy_cost
)
VALUES (%s, %s, %s, %s, %s)
"""

pokemon_cost_sql = """
INSERT INTO pokemon_cost (
    pokID, attack_name, cost
)
VALUES (%s, %s, %s)
"""

pokemon_weakness_sql = """
INSERT INTO pokemon_weakness (
    pokID, weak_type, weak_value
)
VALUES (%s, %s, %s)
"""

pokemon_resistance_sql = """
INSERT INTO pokemon_resistance (
    pokID, resist_type, resist_value
)
VALUES (%s, %s, %s)
"""

pokemon_retreat_cost_sql = """
INSERT INTO pokemon_retreat_cost (
    pokID, cost
)
VALUES (%s, %s)
"""

pokemon_pokedex_number_sql = """
INSERT INTO pokemon_pokedex_number (
    pokID, pokedex_number
)
VALUES (%s, %s)
"""

pokemon_legality_sql = """
INSERT INTO pokemon_legality (
    pokID, card_format, legality
)
VALUES (%s, %s, %s)
"""

pokemon_image_sql = """
INSERT INTO pokemon_image (
    pokID, small_img, large_img
)
VALUES (%s, %s, %s)
"""

pokemon_evolves_to_sql = """
INSERT INTO pokemon_evolves_to (
    pokID, name
)
VALUES (%s, %s)
"""




# more sql commands go below here

page = 1
base_url = "https://api.pokemontcg.io/v2/cards/?page="
requests_made = 0

#while True:
while True:
    url = f"{base_url}{page}"
    response = requests.get(url)
    requests_made += 1

    if response.status_code != 200:
            print(f"Failed on page {page}: {response.status_code}")
            break
    
    data = response.json()
    cards = data.get('data', [])
    if not cards:
            print('No more cards. Stopping.')
            break

    for card in data['data']:
                
        if 'set' in card and card['set']:
            card_set = card['set']
            set_id = card_set.get('id')
            name = card_set.get('name')
            series = card_set.get('series')
            insert_data(mycursor, pokemon_set_sql, (set_id, name, series))
            mydb.commit()

        values = (
            card.get('id'),
            card.get('name'),
            card.get('level'),
            card.get('supertype'),
            card.get('hp'),
            card.get('evolvesFrom'),
            card.get('convertedRetreatCost'),
            card.get('number'),
            card.get('artist'),
            card.get('rarity'),
            card.get('flavortext'),
            card.get('regulationMark'),
            set_id
        )
        insert_data(mycursor, pokemon_card_sql, values)
        mydb.commit()

        if 'evolvesTo' in card and card['evolvesTo']:
            for evolves_to in card:
                insert_data(mycursor, pokemon_evolves_to_sql, (card.get('id'), evolves_to))

        if 'subtypes' in card and card['subtypes']:
            for subtype in card['subtypes']:
                insert_data(mycursor, pokemon_subtype_sql, (card.get('id'), subtype))

        if 'types' in card and card['types']:
            for types in card['types']:
                insert_data(mycursor, pokemon_type_sql, (card.get('id'), types))

        if 'attacks' in card and card['attacks']:
            for attacks in card['attacks']:
                attack_name = attacks.get('name')
                damage = attacks.get('damage')
                attack_text = attacks.get('text')
                converted_energy_cost = attacks.get('convertedEnergyCost')
                insert_data(mycursor, pokemon_attack_sql, (card.get('id'), attack_name, damage, attack_text, converted_energy_cost))

        if 'weaknesses' in card and card['weaknesses']:
            for weaknesses in card['weaknesses']:
                weak_type = weaknesses.get('type')
                weak_value = weaknesses.get('value')
                insert_data(mycursor, pokemon_weakness_sql, (card.get('id'), weak_type, weak_value))
        
        if 'resistances' in card and card['resistances']:
            for resistances in card['resistances']:
                resist_type = resistances.get('type')
                resist_value = resistances.get('value')
                insert_data(mycursor, pokemon_resistance_sql, (card.get('id'), resist_type, resist_value))
        
        if 'retreatCost' in card and card['retreatCost']:
            for cost in card['retreatCost']:
                insert_data(mycursor, pokemon_retreat_cost_sql, (card.get('id'), cost))
        

        
        if 'legalities' in card and card['legalities']:
            for legality in card['legalities']:
                card_legality = card['legalities']
                card_format = card_legality.get('format')
                legality_status = card_legality.get('legality')
                insert_data(mycursor, pokemon_legality_sql, (card.get('id'), card_format, legality_status))
        
        if 'images' in card and card['images']:
            small_img = card['images'].get('small')
            large_img = card['images'].get('large')
            insert_data(mycursor, pokemon_image_sql, (card.get('id'), small_img, large_img))

        if 'nationalPokedexNumbers' in card and card['nationalPokedexNumbers']:
            for num in card['nationalPokedexNumbers']:
                insert_data(mycursor, pokemon_pokedex_number_sql, (card.get('id'), num))

        # more insertions go below here

    mydb.commit()
    print(f"Inserted page {page} ({len(cards)} cards)")

    time.sleep(0.5)

    if requests_made >= 20000:
         print("Hit 20000 requests, end")
         break

    page += 1

print('All cards inserted')