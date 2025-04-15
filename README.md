# 🌐 WiFi Internet Speed Tester 🚀  
A Powerful AI-Enhanced Web App for Real-Time Internet Speed Testing

---

## 📖 Overview  
**WiFi Internet Speed Tester** is a modern, professional-grade web application built with **Flask**, **JavaScript**, and **Chart.js**, enhanced with **AI-powered smart reporting**. It enables users to test their internet connection (download, upload, ping) in real-time and generate beautiful, exportable reports in **CSV** and **PDF** formats — complete with smart summaries and improvement tips.

---

## ✨ Features  

✅ **Real-time Speed Testing**  
- Download, Upload, and Ping measurement  
- Smooth, responsive testing interface  

📊 **Live Graphs with Chart.js**  
- Real-time line charts with animations  
- Clear and visual performance tracking  

🎛️ **Controls & Interaction**  
- Single **Start/Stop** toggle button  
- One-click **Reset** to clear current test data  

🧠 **AI-Powered Smart Summary**  
- Interprets and explains speed test results  
- Suggests improvements for better performance  
- Adapts tone and suggestions based on results  

📁 **Export Options**  
- 📄 PDF report with:
  - AI summary
  - Chart
  - Test table
  - Watermark logo  
- 📊 CSV export of raw test results  

💅 **Modern UI/UX**  
- Clean, responsive interface  
- Colorful themes, emoji enhancements  
- Smooth animations  

---

## 🧠 AI-Generated Summary  
After each test, an integrated AI model provides a tailored summary that:
- Analyzes the quality of your internet connection  
- Identifies potential issues  
- Recommends actionable improvements  
- Changes tone and complexity based on performance

---

## 🗂️ Project Structure  

```plaintext
Internet-Speed-Tester/
│
├── static/              # CSS, JS, images, logos
│   ├── script.js        # Front-end JavaScript logic
│   ├── style.css        # Custom styling and animations
│   └── company-logo.png # Watermark image used in PDF
│
├── templates/
│   └── index.html       # Front-end layout using Jinja2
│
├── app.py               # Core Flask app
├── run.py               # Entry point for running the server
├── requirements.txt     # Python dependencies
└── README.md            # Project documentation
```

## ⚙️ Setup Instructions  

### 1. Clone the Repository  
```bash
git clone https://github.com/your-username/Internet-Speed-Tester.git
cd Internet-Speed-Tester
# On Windows
python -m venv env
env\Scripts\activate
# On macOS/Linux
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
python run.py
```
Now open your browser and go to 👉 http://127.0.0.1:5000

## 🧾 Dependencies

The project uses the following libraries and tools:

- **Flask** – Python web framework
- **Speedtest CLI** – For testing download, upload, and ping
- **Chart.js** – To render real-time graphs on the front-end
- **FPDF** – For PDF generation
- **NumPy** – For simple numerical operations and formatting
- **Custom AI Model** – Generates performance summaries and improvement tips

> 💡 **Note:** Make sure you have an active internet connection when testing, as the tool uses real-time speedtest APIs.

---

## 📄 Sample PDF Report

The auto-generated PDF includes:

- 📊 A clean line chart of speed test results
- 🧠 A smart AI-generated performance summary
- 📋 A detailed table of all test metrics
- ✅ Personalized improvement suggestions
- 🖼️ Your company logo added as a centered watermark

---

## 🌟 Planned Enhancements

Coming soon in future versions:

- 🗂️ Save user test history
- 🔐 Add login/logout with `Flask-Login`
- 📊 Compare results over time
- 🌙 Dark mode toggle switch
- 🐳 Docker container for easy deployment
- ☁️ Deploy to Heroku, Render, or Railway

---

## 🤝 Contributions

Contributions are welcome and encouraged!

If you'd like to contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature-xyz`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to your branch (`git push origin feature-xyz`)
5. Open a pull request 🚀

---

## 👨‍💻 Developer

**Pravakar Das**  
📧 pravakar459@gmail.com  
🔗 [GitHub Profile](https://github.com/PravakarDas)

---

## 📜 License

This project is licensed under the **MIT License**.

You are free to use, modify, and distribute it for personal or commercial purposes — just retain the original license file.

---

