from flask import Flask, jsonify, request
import firebase_admin
from firebase_admin import credentials, firestore
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

cred = credentials.Certificate("app-taskify-firebase-adminsdk-kmllv-103becd50b.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

TASKS_COLLECTION = 'Tasks'

@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks_ref = db.collection(TASKS_COLLECTION)
    tasks = tasks_ref.stream()
    tasks_list = [{**task.to_dict(), 'id': task.id} for task in tasks]
    return jsonify(tasks_list), 200

@app.route('/tasks', methods=['POST'])
def add_task():
    data = request.get_json()
    task_ref = db.collection(TASKS_COLLECTION).add(data)
    return jsonify({"id": task_ref[1].id}), 201

@app.route('/tasks/<task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.get_json()
    task_ref = db.collection(TASKS_COLLECTION).document(task_id)
    task_ref.update(data)
    return jsonify({"status": "updated"}), 200

@app.route('/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    db.collection(TASKS_COLLECTION).document(task_id).delete()
    return jsonify({"status": "deleted"}), 200

if __name__ == '__main__':
    app.run(debug=True)
