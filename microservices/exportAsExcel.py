from flask import Flask, jsonify, request, send_file
import firebase_admin
from firebase_admin import credentials, firestore
from openpyxl import Workbook
from flask_cors import CORS
import os

app = Flask(__name__)

CORS(app)

cred = credentials.Certificate("app-taskify-firebase-adminsdk-kmllv-103becd50b.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

TASKS_COLLECTION = 'Tasks'

@app.route('/export_tasks', methods=['GET'])
def export_tasks_to_excel():
    tasks_ref = db.collection(TASKS_COLLECTION)
    tasks = tasks_ref.stream()

    wb = Workbook()
    ws = wb.active
    ws.title = "Tasks"

    ws.append(["Task ID", "Title", "Description", "Status"])

    for task in tasks:
        task_data = task.to_dict()
        ws.append([task.id, task_data.get("name"), task_data.get("desc"), task_data.get("state")])

    file_path = "tasks.xlsx"
    wb.save(file_path)
    return send_file(file_path, as_attachment=True, download_name="tasks.xlsx")

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5001, debug=True)
