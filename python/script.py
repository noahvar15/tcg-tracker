import mysql.connector

# Establish connection with db
mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    passwd="root"
)

# create cursor
mycursor = mydb.cursor()

mycursor.execute("create schema tcg_tracker")