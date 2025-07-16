# backend/app.py

from flask import Flask, jsonify
from flask_cors import CORS
# from routes.auth import auth_bp  # Comment out - file doesn't exist yet
# from routes.api import api_bp # Comment out - file doesn't exist yet
from routes.prediction_routes import prediction_bp # Import your new blueprint
from ml.utils import load_ml_artifacts # Import to ensure model is loaded on startup

app = Flask(__name__)
CORS(app) # Apply CORS to the entire app, or just specific blueprints/routes as needed

# Load ML artifacts when the app starts
with app.app_context():
    load_ml_artifacts() # This will load your model and scaler when the app context is pushed

# Register blueprints
# app.register_blueprint(auth_bp, url_prefix='/auth')  # Comment out - blueprint doesn't exist yet
# app.register_blueprint(api_bp, url_prefix='/api')  # Comment out - blueprint doesn't exist yet
app.register_blueprint(prediction_bp, url_prefix='/ml') # Prefix your ML API calls with /ml

@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Fullstack Flask Backend!"})

if __name__ == '__main__':
    app.run(debug=True) # Set debug=False in production