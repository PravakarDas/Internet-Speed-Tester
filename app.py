from flask import Flask, render_template, request, jsonify
from datetime import datetime
import speedtest
from ping3 import ping
import statistics
import time

app = Flask(__name__)

def get_ping_and_jitter(host="google.com", count=5):
    pings = []
    for _ in range(count):
        delay = ping(host, unit='ms')
        if delay is not None:
            pings.append(delay)
        time.sleep(0.2)  # slight delay between pings

    if not pings:
        return {"ping": None, "jitter": None}

    jitter = statistics.stdev(pings) if len(pings) > 1 else 0
    return {
        "ping": round(statistics.mean(pings), 2),
        "jitter": round(jitter, 2)
    }

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/start', methods=['POST'])
def start_test():
    data = request.get_json()
    duration = int(data.get('duration', 1))  # currently unused
    checks = int(data.get('checks', 1))

    results = []
    for _ in range(checks):
        # Perform speedtest
        st = speedtest.Speedtest()
        st.get_best_server()
        download_speed = round(st.download() / 1_000_000, 2)  # in Mbps
        upload_speed = round(st.upload() / 1_000_000, 2)      # in Mbps

        # Get ping and jitter
        ping_data = get_ping_and_jitter()

        result = {
            "time": datetime.now().strftime("%H:%M:%S"),
            "download": download_speed,
            "upload": upload_speed,
            "ping": ping_data["ping"],
            "jitter": ping_data["jitter"]
        }

        results.append(result)

    return jsonify({"results": results})

if __name__ == '__main__':
    app.run(debug=True)
