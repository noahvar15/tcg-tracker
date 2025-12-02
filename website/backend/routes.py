from dotenv import load_dotenv
from flask import Blueprint, jsonify, request, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from db import get_db_connection
import jwt
import datetime
from functools import wraps
import os

# -------------------------
#   Yes, I used GPT to help speed run this shi - Manny
# -------------------------

cards_bp = Blueprint("cards", __name__)
auth = Blueprint('auth', __name__)


load_dotenv() 

SECRET_KEY = os.getenv("SECRET_KEY")


# -------------------------
#   JWT Helpers
# -------------------------

def token_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        token = None

        if "Authorization" in request.headers:
            try:
                token = request.headers["Authorization"].split(" ")[1]
            except:
                return jsonify({"error": "Invalid Authorization header"}), 401

        if not token:
            return jsonify({"error": "Token missing"}), 401

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            request.user_id = data["user_id"]
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except:
            return jsonify({"error": "Invalid token"}), 401

        return f(*args, **kwargs)
    return wrapper


# -------------------------
#   Cards Routes
# -------------------------

@cards_bp.get("/all_collection_sizes")
def get_collection_with_size():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM collection_with_size;")
    
    result = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(result)


@cards_bp.get("/most_owned_cards")
def get_most_owned_cards():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM most_owned_cards;")
    result = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(result)


@cards_bp.get("/search")
def search_mtg_cards():
    query = request.args.get("q", "")

    if not query:
        return jsonify({"error": "Missing search query"}), 400

    conn = get_db_connection()

    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = conn.cursor(dictionary=True)

    sql = """
        SELECT card_name AS name, small_img AS image, 'pokemon' AS type, pokID AS id
        FROM pokemon_card
        JOIN pokemon_image USING (pokID)
        WHERE small_img IS NOT NULL AND card_name LIKE %s

        UNION ALL

        SELECT name, image, 'mtg' AS type, mtgID AS id
        FROM mtg_card
        WHERE image IS NOT NULL AND name LIKE %s;
    """

    cursor.execute(sql, (f"%{query}%", f"%{query}%"))
    results = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(results)



@cards_bp.get("/pokemon/search")
def search_pokemon_cards():
    query = request.args.get("q", "")

    if not query:
        return jsonify({"error": "Missing search query"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    sql = """
        SELECT pokID AS id, card_name AS name, card_number, pokID,
               (SELECT small_img FROM pokemon_image WHERE pokemon_image.pokID = pokemon_card.pokID) AS image
        FROM pokemon_card
        WHERE card_name LIKE %s OR pokID = %s OR card_number = %s
    """

    cursor.execute(sql, (f"%{query}%", query, query))
    results = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(results)

@cards_bp.get("/mtg/sets/<set_code>")
def get_mtg_set(set_code):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Fetch ONE set row
    cursor.execute("SELECT * FROM mtg_card WHERE set_code = %s LIMIT 1", (set_code,))
    result = cursor.fetchone()

    cursor.close()
    conn.close()

    if not result:
        return jsonify({"error": "Set not found"}), 404

    return jsonify(result)


@cards_bp.get("/mtg/cards/<set_code>")
def get_mtg_cards_by_set(set_code):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Fetch all MTG cards from the set
    cursor.execute("""
        SELECT mtgID as id, name, image, 'mtg' as type 
        FROM mtg_card
        WHERE set_code = %s
    """, (set_code,))

    cards = cursor.fetchall()

    cursor.close()
    conn.close()

    if not cards:
        return jsonify({"error": "Cards not found"}), 404

    return jsonify(cards)

@cards_bp.get("/pokemon/sets/<set_id>")
def get_pkmn_set(set_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM pokemon_set WHERE set_id = %s", (set_id,))
    set = cursor.fetchone()

    cursor.close()
    conn.close()

    if not set:
        return jsonify({"error": "Set not found"}), 404

    return jsonify(set)

@cards_bp.get("/pokemon/cards/<set_id>")
def get_pkmn_cards_by_set(set_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT c.pokID as id, 'pokemon' as type, c.card_name, i.small_img, i.large_img FROM pokemon_card c LEFT JOIN pokemon_image i ON c.pokID = i.pokID WHERE c.set_id = %s;", (set_id,))
    cards = cursor.fetchall()

    cursor.close()
    conn.close()

    if not cards:
        return jsonify({"error": "Cards not found"}), 404

    return jsonify(cards)


@cards_bp.get("/mtg/<mtg_id>")
def get_mtg_card(mtg_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM mtg_card WHERE mtgID = %s", (mtg_id,))
    card = cursor.fetchone()

    cursor.close()
    conn.close()

    if not card:
        return jsonify({"error": "Card not found"}), 404

    return jsonify(card)

@cards_bp.get("/pokemon/<pok_id>")
def get_pokemon_card(pok_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT pc.*, pi.small_img, pi.large_img
        FROM pokemon_card pc
        LEFT JOIN pokemon_image pi ON pc.pokID = pi.pokID
        WHERE pc.pokID = %s
    """, (pok_id,))
    
    card = cursor.fetchone()

    cursor.close()
    conn.close()

    if not card:
        return jsonify({"error": "Card not found"}), 404

    return jsonify(card)

@cards_bp.get("/mtg/random50")
def random_mtg_50():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""SELECT * FROM view_mtg_ui ORDER BY RAND() LIMIT 50;""")

    results = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(results)

@cards_bp.get("/pokemon/random50")
def random_pokemon_50():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""SELECT * FROM view_pokemon_ui ORDER BY RAND() LIMIT 50;""")

    results = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(results)


@cards_bp.get("/collections/user/<user_id>")
def get_user_collections(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""SELECT * FROM view_user_collections WHERE uID = %s;""", (user_id,))

    results = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(results)
@cards_bp.get("/collection/<collection_id>")
def get_cards_in_collection(collection_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    card_type = request.args.get("type")  # 'mtg', 'pokemon', or None

    base_sql = """
        SELECT type as card_type, id, name, image, card_number
        FROM view_collection_all_cards
        WHERE collectionID = %s
    """

    params = [collection_id]

    if card_type in ("mtg", "pokemon"):
        base_sql += " AND type = %s"
        params.append(card_type)

    cursor.execute(base_sql, tuple(params))
    results = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(results)


@cards_bp.get("/collection_mtg/<collection_id>")
def get_mtg_in_collection(collection_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""view_collection_mtg_cards """, (collection_id,))

    results = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(results)

@cards_bp.get("/collection_pokemon/<collection_id>")
def get_pokemon_in_collection(collection_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""view_collection_pokemon_cards """, (collection_id,))

    results = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(results)
@cards_bp.post("/collection/<collection_id>/remove_card")
@token_required
def remove_card_from_collection(collection_id):
    data = request.json or {}
    card_type = data.get("card_type")  # 'mtg' or 'pokemon'
    card_id = data.get("id")

    if card_type not in ("mtg", "pokemon") or not card_id:
        return jsonify({"error": "card_type and id required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        if card_type == "mtg":
            cursor.execute(
                "DELETE FROM mtg_collection WHERE mtgID = %s AND collectionID = %s",
                (card_id, collection_id),
            )
        else:
            cursor.execute(
                "DELETE FROM pokemon_collection WHERE pokID = %s AND collectionID = %s",
                (card_id, collection_id),
            )

        cursor.execute(
            "UPDATE collection SET size = GREATEST(size - 1, 0) WHERE collectionID = %s",
            (collection_id,),
        )

        conn.commit()
    finally:
        cursor.close()
        conn.close()

    return jsonify({"message": "Card removed from collection"}), 200

@cards_bp.post("/collection/<collection_id>/add_card")
@token_required
def add_card_to_collection(collection_id):
    data = request.json or {}
    card_type = data.get("card_type")  # 'mtg' or 'pokemon'
    card_id = data.get("id")

    if card_type not in ("mtg", "pokemon") or not card_id:
        return jsonify({"error": "card_type and id required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        if card_type == "mtg":
            cursor.execute(
                "INSERT IGNORE INTO mtg_collection (mtgID, collectionID) VALUES (%s, %s)",
                (card_id, collection_id),
            )
        else:
            cursor.execute(
                "INSERT IGNORE INTO pokemon_collection (pokID, collectionID) VALUES (%s, %s)",
                (card_id, collection_id),
            )

        cursor.execute(
            "UPDATE collection SET size = size + 1 WHERE collectionID = %s",
            (collection_id,),
        )

        conn.commit()
    finally:
        cursor.close()
        conn.close()

    return jsonify({"message": "Card added to collection"}), 200

@cards_bp.post("/collection/create")
def create_collection():
    data = request.get_json()

    uID = data.get("uID")
    collection_name = data.get("collection_name")
    descriptor = data.get("descriptor", "")

    if not uID or not collection_name:
        return jsonify({"error": "uID and collection_name are required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        INSERT INTO collection (uID, collection_name, descriptor)
        VALUES (%s, %s, %s)
    """, (uID, collection_name, descriptor))

    conn.commit()

    new_id = cursor.lastrowid

    cursor.close()
    conn.close()

    return jsonify({
        "message": "Collection created",
        "collectionID": new_id,
        "collection_name": collection_name,
        "descriptor": descriptor,
        "size": 0
    }), 201



# -------------------------
#   Auth Routes
# -------------------------

@auth.post("/signup")
def signup():
    print("-> SIGNUP HIT")
    data = request.json
    print("-> DATA:", data)

    try:
        conn = get_db_connection()
        print("-> CONNECTION:", conn)
    except Exception as e:
        print("-> CONNECTION FAILED:", e)

    cursor = conn.cursor(dictionary=True)
    print("-> CURSOR CREATED")

    ###########
    first_name = data.get("first_name")
    middle_init = data.get("middle_initial")
    last_name = data.get("last_name")
    email = data.get("email")
    password = data.get("password")
    dob = data.get("dob")


    if not all([first_name, middle_init, last_name, email, password]):
        return jsonify({"error": "Missing required fields"}), 400

    cursor.execute("SELECT * FROM user WHERE email = %s", (email,))
    if cursor.fetchone():
        return jsonify({"error": "Email already exists"}), 409

    hashed_pw = generate_password_hash(password)

    cursor.execute("""
        INSERT INTO user (first_name, middle_initial, last_name, email, DOB, password_hash)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (first_name, middle_init, last_name, email, dob, hashed_pw))
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "User created successfully"}), 201


@auth.post("/login")
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM user WHERE email = %s", (email,))
    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if user is None:
        return jsonify({"error": "Invalid email or password"}), 401

    if not check_password_hash(user["password_hash"], password):
        return jsonify({"error": "Invalid email or password"}), 401

    payload = {
        "user_id": user["uID"],
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=12)
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

    return jsonify({
        "message": "Login successful",
        "token": token
    }), 200


@auth.post("/verify")  
@token_required
def verify_user():
    print("-> VERIFY HIT")
    return jsonify({"message": "Valid token", "user_id": request.user_id}), 200

@auth.get('/get_user')
@token_required
def get_user():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT  uID, first_name, last_name, email, DOB from user where uID = %s", (request.user_id,))
    user = cursor.fetchone()

    cursor.close()
    conn.close()
    if not user:
        return jsonify({"error": "User Not Found"})
    return jsonify(user), 200


#

@cards_bp.route("/collections/<int:collection_id>/rename", methods=["PUT"])
@token_required 
def rename_collection(collection_id):
    current_user = request.user_id
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    data = request.get_json()
    new_name = data.get("new_name")

    if not new_name:
        return jsonify({"error": "Collection name required"}), 400

    try:
        query = """
            UPDATE collection
            SET collection_name = %s
            WHERE collectionID = %s AND uID = %s
        """
        cursor.execute(query, (new_name, collection_id, current_user))
        conn.commit()

        return jsonify({"message": "Collection renamed"}), 200

    except Exception as e:
        print("Rename error:", e)
        return jsonify({"error": "Rename failed"}), 500