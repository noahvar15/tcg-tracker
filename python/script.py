import mysql.connector

# Establish connection with db
mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    passwd="root",
    database="tcg_tracker"
)

# create cursor
mycursor = mydb.cursor()