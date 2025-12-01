from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

def create_app():
    load_dotenv()

    app = Flask(__name__)

    CORS(app, supports_credentials=True)

    global SECRET_KEY
    SECRET_KEY = os.getenv("SECRET_KEY")
    app.config["SECRET_KEY"] = SECRET_KEY

    from routes import cards_bp, auth

    app.register_blueprint(cards_bp, url_prefix="/api/cards")
    app.register_blueprint(auth, url_prefix="/api")

    return app

app = create_app()


if __name__ == "__main__":
    app.run(debug=True, port=5001)

