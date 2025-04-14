from flask import Flask, render_template, jsonify, request, send_file
import threading
import time
import csv
import os
import speedtest
import random
from datetime import datetime
import requests

app = Flask(__name__)
test_data = []
is_testing = False
lock = threading.Lock()
test_duration = 0
start_time = 0
test_frequency = "normal"


@app.route('/')
def index():
    # Auto-delete test_results.csv if it exists
    csv_path = os.path.join(os.getcwd(), 'test_results.csv')
    if os.path.exists(csv_path):
        os.remove(csv_path)

    return render_template('index.html')


@app.route('/start_test', methods=['POST'])
def start_test():
    global is_testing, test_data, test_duration, start_time, test_frequency

    data = request.get_json()
    test_duration = int(data.get('duration', 30))
    test_frequency = data.get('frequency', 'normal')
    with lock:
        test_data = []
        is_testing = True
        start_time = time.time()

    threading.Thread(target=run_test).start()
    return jsonify({"status": "started"})


def run_test():
    global is_testing
    while True:
        with lock:
            if not is_testing or (time.time() - start_time) >= test_duration:
                is_testing = False
                break

        # Perform test
        try:
            st = speedtest.Speedtest()
            st.get_best_server()
            download = round(st.download() / 1_000_000, 2)
            upload = round(st.upload() / 1_000_000, 2)
            ping = round(st.results.ping, 2)
            timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

            # Get public IP
            try:
                ip_address = requests.get('https://api.ipify.org').text
            except:
                ip_address = "Unavailable"

            result = {
                "timestamp": timestamp,
                "download": download,
                "upload": upload,
                "ping": ping,
                "ip": ip_address
            }

            with lock:
                test_data.append(result)

        except Exception as e:
            with lock:
                test_data.append({
                    "timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                    "download": "Error",
                    "upload": "Error",
                    "ping": "Error",
                    "ip": "Unavailable"
                })

        if test_frequency == "fast":
            sleep_time = 1
        elif test_frequency == "slow":
            sleep_time = 5
        else:
            sleep_time = 3

        time.sleep(sleep_time)



@app.route('/get_status')
def get_status():
    with lock:
        if not is_testing:
            return jsonify({
                "status": "completed",
                "data": test_data,
                "progress": 100,
                "elapsed_time": int(time.time() - start_time)
            })

        elapsed = int(time.time() - start_time)
        progress = min(int((elapsed / test_duration) * 100), 100)
        return jsonify({
            "status": "running",
            "data": test_data,
            "progress": progress,
            "elapsed_time": elapsed
        })


@app.route('/stop_test')
def stop_test():
    global is_testing
    with lock:
        is_testing = False
    return jsonify({"status": "stopped"})


@app.route('/download')
def download():
    filename = 'test_results.csv'
    filepath = os.path.join(os.getcwd(), filename)

    with open(filepath, 'w', newline='') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=["timestamp", "download", "upload", "ping", "ip"])
        writer.writeheader()
        for row in test_data:
            writer.writerow(row)

    return send_file(filepath, as_attachment=True)


if __name__ == '__main__':
    app.run(debug=True)
