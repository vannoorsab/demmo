from flask import Flask, render_template, request, jsonify
import sqlite3
import numpy as np
from sklearn.linear_model import LinearRegression
import os
import logging

app = Flask(__name__)
logging.basicConfig(level=logging.DEBUG)
db_path = os.path.join(os.path.dirname(__file__), 'students.db')
model = LinearRegression()
X = np.array([[9, 8, 3, 2, 1], [7, 8, 5, 0, 2], [10, 9, 2, 5, 3]])
y = np.array([90, 85, 95])
model.fit(X, y)

def init_db():
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS students
                 (name TEXT, batch INT, academic REAL, core_courses REAL, 
                 hackathons INT, papers INT, contributions INT, score REAL)''')
    conn.commit()
    conn.close()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/submit', methods=['POST'])
def submit():
    try:
        data = request.json
        logging.debug(f"Received data: {data}")

        academic = float(data['academic'])
        core_courses = float(data['core_courses'])
        hackathons = int(data['hackathons'])
        papers = int(data['papers'])
        contributions = int(data['contributions'])

        input_data = np.array([[academic, core_courses, hackathons, papers, contributions]])
        predicted_score = model.predict(input_data)[0]

        logging.debug(f"Predicted score: {predicted_score}")

        conn = sqlite3.connect(db_path)
        c = conn.cursor()
        c.execute("INSERT INTO students (name, batch, academic, core_courses, hackathons, papers, contributions, score) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                  (data['name'], data['batch'], academic, core_courses, hackathons, papers, contributions, predicted_score))
        conn.commit()
        conn.close()

        return jsonify({"predicted_score": predicted_score})
    except Exception as e:
        logging.error(f"An error occurred: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/top_students', methods=['GET'])
def get_top_students():
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    c.execute("SELECT name, score FROM students ORDER BY score DESC LIMIT 3")
    top_students = c.fetchall()
    conn.close()
    return jsonify({"top_students": [{"name": s[0], "score": s[1]} for s in top_students]})

if __name__ == '__main__':
    init_db()
    app.run(debug=True)