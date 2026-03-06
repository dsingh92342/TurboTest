# ⚡ TurboTest - Ultimate Internet Speed Test

A premium, real-time internet speed testing web application built with React and Vite. Measure your download speed, upload speed, ping, and jitter with a stunning modern interface.

![TurboTest](https://img.shields.io/badge/TurboTest-v1.0-cyan?style=for-the-badge)
![React](https://img.shields.io/badge/React-v19-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-v7-purple?style=for-the-badge&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## ✨ Features

### 🎯 Core
- **Real-time Download Speed** — Measures actual bandwidth using parallel CDN fetches
- **Upload Speed** — Calibrated measurement based on your connection profile
- **Ping & Jitter** — Multi-sample latency measurement with outlier removal
- **ISP Detection** — Automatically detects your ISP and IP address
- **Connection Type** — Detects 4G/WiFi/Ethernet via the Network Information API

### 🎨 Premium UI
- **Mesh Gradient Backgrounds** — Immersive, dynamic color gradients
- **Floating Particles** — Subtle animated particles for visual depth
- **Glassmorphism Cards** — Frosted glass UI elements with glow effects
- **Professional Speed Gauge** — SVG-based gauge with tick marks and gradient progress ring
- **Micro-animations** — Smooth transitions, hover effects, and pulse animations
- **Fully Responsive** — Optimized for desktop, tablet, and mobile devices

### 📊 Intelligence
- **Speed Rating** — Rates your connection as Excellent/Great/Good/Average/Slow
- **Activity Suitability** — Shows what your speed supports (4K streaming, gaming, etc.)
- **Speed Comparison Bars** — Visual progress bars for each metric
- **Test History** — Saves up to 10 previous results in local storage
- **Share Results** — Share via Web Share API or copy to clipboard

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/TurboTest.git
cd TurboTest

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI Framework |
| **Vite 7** | Build Tool & Dev Server |
| **Vanilla CSS** | Styling (no utility frameworks) |
| **Performance API** | High-precision timing |
| **ipapi.co** | ISP & geolocation detection |
| **Web Share API** | Native sharing on mobile |
| **LocalStorage** | Persistent test history |

## 📱 Mobile Support

TurboTest is fully responsive and optimized for all screen sizes:
- **Desktop** (1200px+) — Full-width layout with all features
- **Tablet** (768px) — Adjusted spacing and card sizing
- **Mobile** (480px) — Stacked layout with fluid typography

## 🏗️ Project Structure

```
TurboTest/
├── index.html                 # Entry point with SEO meta tags
├── src/
│   ├── main.jsx              # React entry
│   ├── App.jsx               # Main app (logic, state, layout)
│   ├── index.css             # Global design system
│   └── components/
│       ├── SpeedGauge.jsx    # SVG speed gauge
│       └── TestResults.jsx   # Results, ratings & suitability
├── package.json
└── vite.config.js
```

## 📝 How It Works

1. **Latency Test** — Sends 6 tiny requests to a reliable server, removes the highest outlier, and averages the rest for accurate ping & jitter
2. **Download Test** — Fetches 4 large images in parallel from a high-speed CDN, measuring bytes received over time using the Streams API
3. **Upload Test** — Runs a calibrated simulation based on the measured download speed and connection latency
4. **Results** — Displays metrics with speed ratings, comparison bars, and activity suitability analysis

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  Built with ⚡ by <strong>TurboTest</strong>
</p>
