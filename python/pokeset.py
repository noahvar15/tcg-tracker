import requests
import mysql.connector
import time

# Establish connection with db
mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    passwd="password",
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
pokemon_set_sql = """
INSERT INTO pokemon_set (
    set_id,
    name, 
    series
)
VALUES (%s, %s, %s)
"""






# more sql commands go below here

page = 1
base_url = "https://api.pokemontcg.io/v2/sets/?page="
requests_made = 0

#while True:
while page <= 1:
    url = f"{base_url}{page}"
    response = requests.get(url)
    requests_made += 1
    page += 1

    if response.status_code != 200:
            print(f"Failed on page {page-1}: {response.status_code}")
            if (response.status_code in (404, 504)):
                time.sleep(0.5)
                page -= 1
                print(f"Retrying page {page}...")
                continue
            else:
                break
    
    data = response.json()
    sets = data.get('data', [])
    if not sets:
            print('No more sets. Stopping.')
            break

    for set in data['data']:
                
        values = (
            set.get('id'),
            set.get('name'),
            set.get('series'),
        )
        insert_data(mycursor, pokemon_set_sql, values)
        mydb.commit()
    print(f"Inserted page {page-1} ({len(set)} sets)")

    time.sleep(0.5)

    if requests_made >= 20000:
         print("Hit 20000 requests, end")
         break


print('All sets inserted')