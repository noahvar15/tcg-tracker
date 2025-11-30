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
    last_name = data.get("last_name")
    email = data.get("email")
    password = data.get("password")

    if not all([first_name, last_name, email, password]):
        return jsonify({"error": "Missing required fields"}), 400

    cursor.execute("SELECT * FROM user WHERE email = %s", (email,))
    if cursor.fetchone():
        return jsonify({"error": "Email already exists"}), 409

    hashed_pw = generate_password_hash(password)

    cursor.execute("""
        INSERT INTO user (first_name, last_name, email, password_hash)
        VALUES (%s, %s, %s, %s)
    """, (first_name, last_name, email, hashed_pw))
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
    return jsonify({"message": "Valid token", "user_id": request.user_id}), 200
