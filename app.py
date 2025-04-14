from flask import Flask, render_template, jsonify, request, send_file
import threading
import time
import csv
import os
import speedtest
import random
from datetime import datetime
import requests
from fpdf import FPDF
import matplotlib.pyplot as plt

app = Flask(__name__)
test_data = []
is_testing = False
lock = threading.Lock()
test_duration = 0
start_time = 0
test_frequency = "normal"


@app.route('/')
def index():
    # Auto-delete generated files if they exist
    for file in ['test_results.csv', 'chart.png', 'speed_report.pdf']:
        path = os.path.join(os.getcwd(), file)
        if os.path.exists(path):
            os.remove(path)
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

@app.route('/generate_pdf')
def generate_pdf():
    if not test_data:
        return jsonify({"error": "No data to generate PDF"}), 400

    # Create chart image
    timestamps = [entry['timestamp'] for entry in test_data if isinstance(entry['download'], float)]
    download_speeds = [entry['download'] for entry in test_data if isinstance(entry['download'], float)]
    upload_speeds = [entry['upload'] for entry in test_data if isinstance(entry['upload'], float)]
    ping_speeds = [entry['ping'] for entry in test_data if isinstance(entry['ping'], float)]

    plt.figure(figsize=(10, 4))
    plt.plot(timestamps, download_speeds, label='Download (Mbps)', color='green')
    plt.plot(timestamps, upload_speeds, label='Upload (Mbps)', color='blue')
    plt.plot(timestamps, ping_speeds, label='Ping (ms)', color='red')
    plt.xticks(rotation=45)
    plt.title("WiFi Speed Test Results")
    plt.xlabel("Time")
    plt.ylabel("Speed")
    plt.legend()
    plt.tight_layout()
    plt.savefig("chart.png")
    plt.close()

    # Generate dynamic summary
    def generate_summary(download, upload, ping):
        min_d = min(download)
        max_d = max(download)
        min_u = min(upload)
        max_u = max(upload)
        min_p = min(ping)
        max_p = max(ping)

        if min_d > 50 and min_u > 50 and max_p < 50:
            status = "excellent"
        elif min_d > 10 and min_u > 10 and max_p < 100:
            status = "moderate"
        else:
            status = "poor"

        summary = f"The provided WiFi speed test data indicates a **{status}** network condition.\n\n"
        summary += f"- Download speeds range from {min_d:.2f} Mbps to {max_d:.2f} Mbps.\n"
        summary += f"- Upload speeds range from {min_u:.2f} Mbps to {max_u:.2f} Mbps.\n"
        summary += f"- Ping ranges from {min_p:.2f} ms to {max_p:.2f} ms.\n\n"

        if status == "excellent":
            summary += ("Performance Evaluation:\n"
                        "- Streaming: Supports 4K+ content with ease.\n"
                        "- Gaming: Excellent, low latency ensures lag-free gameplay.\n"
                        "- Work: Great for video calls, uploads/downloads, and remote work.\n\n"
                        "Suggestions:\n"
                        "- Maintain current setup.\n"
                        "- Use 5GHz WiFi for higher speeds.\n")
        elif status == "moderate":
            summary += ("Performance Evaluation:\n"
                        "- Streaming: Supports HD, some buffering possible in 4K.\n"
                        "- Gaming: Acceptable, occasional lags possible.\n"
                        "- Work: Good for browsing and video calls, minor interruptions possible.\n\n"
                        "Suggestions:\n"
                        "- Reduce background devices.\n"
                        "- Optimize router placement.\n")
        else:
            summary += ("Performance Evaluation:\n"
                        "- Streaming: Buffering expected even at HD.\n"
                        "- Gaming: Not recommended due to high ping.\n"
                        "- Work: Unstable for video calls or large uploads.\n\n"
                        "Suggestions:\n"
                        "- Contact your ISP.\n"
                        "- Upgrade your plan or router.\n"
                        "- Use wired (Ethernet) connection if possible.\n")

        return summary

    summary = generate_summary(download_speeds, upload_speeds, ping_speeds)

    # Create PDF
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", 'B', 16)
    pdf.cell(0, 10, "WiFi Speed Test Report", ln=True, align='C')
    pdf.ln(10)

    pdf.set_font("Arial", size=12)
    for line in summary.strip().split('\n'):
        pdf.multi_cell(0, 8, line)

    pdf.ln(5)
    pdf.image("chart.png", x=10, w=190)
    pdf.ln(10)

    pdf.set_font("Arial", 'B', 14)
    pdf.cell(0, 10, "Raw Test Data", ln=True)

    pdf.set_font("Arial", size=10)
    col_width = 190 / 5
    for entry in test_data:
        row = [entry['timestamp'], str(entry['download']), str(entry['upload']),
               str(entry['ping']), entry['ip']]
        for item in row:
            pdf.cell(col_width, 7, item, border=1)
        pdf.ln()

    pdf.output("speed_report.pdf")
    return send_file("speed_report.pdf", as_attachment=True)
if __name__ == '__main__':
    app.run(debug=True)
