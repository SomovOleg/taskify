from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, auth, firestore
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

cred = credentials.Certificate("app-taskify-firebase-adminsdk-kmllv-103becd50b.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

@app.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    try:
        user = auth.create_user(email=email, password=password)
        return jsonify({"message": "User created", "uid": user.uid}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    try:
        user = auth.get_user_by_email(email)
        return jsonify(user.uid), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/login/<uid>', methods=['GET'])
def get_user_info(uid):
    try:
        user_info = db.collection('Users').document(uid).get()
        if user_info.exists:
            return jsonify(user_info.to_dict()), 200
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/verify_token', methods=['POST'])
def verify_token():
    data = request.get_json()
    token = data.get('token')

    try:
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token['uid']
        return jsonify({"message": "Token is valid", "uid": uid}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 401

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5001)
