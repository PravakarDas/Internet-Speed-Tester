from flask import Flask, render_template, request, jsonify
from datetime import datetime
import random

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/start', methods=['POST'])
def start_test():
    data = request.get_json()
    duration = int(data.get('duration', 1))
    checks = int(data.get('checks', 1))

    # Generate mock results (later we will run real tests here)
    results = []
    for i in range(checks):
        result = {
            "time": datetime.now().strftime("%H:%M:%S"),
            "download": round(random.uniform(30, 100), 2),
            "upload": round(random.uniform(10, 50), 2),
            "ping": round(random.uniform(10, 80), 2)
        }
        results.append(result)

    return jsonify({"results": results})

if __name__ == '__main__':
    app.run(debug=True)
