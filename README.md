<div align="center">

# ⚡ TurboTest

### Free & Accurate Internet Speed Test

**Measure your download speed, upload speed, ping and jitter instantly.**
No ads. No signup. No data collected.

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-TurboTest-00e5ff?style=for-the-badge)](https://dsingh92342.github.io/TurboTest/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646cff?style=flat-square&logo=vite)](https://vite.dev)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](LICENSE)
[![PWA](https://img.shields.io/badge/PWA-Ready-a855f7?style=flat-square)](https://web.dev/progressive-web-apps/)

---

[**Try it now →**](https://dsingh92342.github.io/TurboTest/)

</div>

## ✨ Features

### 🎯 Speed Testing
- **Real-time Download Measurement** — Parallel CDN fetches with Streams API for accurate bandwidth detection
- **Upload Speed** — Calibrated measurement based on your connection profile
- **Ping & Jitter** — 8-sample latency measurement with outlier removal (removes highest & lowest)
- **Live Speed Chart** — Canvas-based real-time visualization of speed fluctuations during the test

### 📡 Network Intelligence
- **ISP Detection** — Automatically identifies your Internet Service Provider via ipapi.co
- **IP Address Display** — Shows your public IP address
- **Connection Type** — Detects WiFi, 4G, 3G, etc. via the Network Information API
- **Connection Stability Score** — Calculates stability percentage from ping consistency and jitter ratio

### 🏆 Analysis
- **Speed Rating** — Rates your connection: Excellent 🚀 / Great ⚡ / Good / Average ⚠ / Slow 🐌
- **Activity Suitability** — Shows compatibility with HD streaming, 4K, gaming, cloud gaming, video calls
- **Smart Tips** — Contextual improvement suggestions based on your actual results
- **Speed Comparison Bars** — Visual progress bars showing relative performance

### 💾 Data & Sharing
- **Test History** — Saves up to 10 results locally (localStorage, no server)
- **Share Results** — Web Share API on mobile, clipboard fallback on desktop
- **Clear History** — One-click history management

### 🎨 Premium Design
- **Dark & Light Themes** — Toggle with persistence (saved in localStorage)
- **Floating Particles** — Animated particle system for visual depth
- **Ambient Gradients** — Drifting background color blobs
- **Glassmorphism** — Frosted glass cards with backdrop blur
- **Professional Gauge** — SVG-based with tick marks, gradient ring, and glow effects
- **Micro-animations** — Smooth transitions, pulse glow during testing, slide-in elements
- **Fully Responsive** — Optimized for desktop, tablet, and mobile (fluid typography with `clamp()`)

### 🔍 SEO & AEO
- **Schema.org Structured Data** — WebApplication, FAQPage (6 questions), HowTo schemas
- **Full Meta Tags** — Title, description, keywords, canonical URL, Open Graph, Twitter Cards
- **Semantic HTML5** — `<header>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<time>`, `<nav>`
- **PWA Manifest** — Installable as a standalone app
- **robots.txt & sitemap.xml** — Proper crawler guidance

### ♿ Accessibility
- **ARIA Labels** — Every interactive element and section has descriptive ARIA attributes
- **Keyboard Navigation** — Press `Space` to start test, `Enter`/`Space` for FAQ items
- **Screen Reader Support** — `role="meter"` on gauge, `role="status"` with `aria-live="polite"`
- **Semantic Structure** — Proper heading hierarchy (h1 → h2 → h3)

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/dsingh92342/TurboTest.git
cd TurboTest

# Install
npm install

# Run locally
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 📦 Deploy to GitHub Pages

```bash
npm run deploy
```

This builds the project and pushes the `dist/` folder to the `gh-pages` branch automatically.

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | React 19 | Component architecture, hooks for state management |
| **Build** | Vite 7 | Lightning-fast HMR and optimized production builds |
| **Styling** | Vanilla CSS | Full control, no framework overhead, CSS variables for theming |
| **Charts** | Canvas API | Performant real-time speed visualization |
| **Gauge** | SVG | Resolution-independent, animatable speed gauge |
| **Network** | Fetch + Streams API | Real-time byte-level download tracking |
| **ISP Data** | ipapi.co | Free geolocation and ISP detection |
| **PWA** | Web App Manifest | Installable standalone experience |
| **Deploy** | gh-pages | One-command deployment to GitHub Pages |

---

## 📁 Project Structure

```
TurboTest/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── robots.txt             # Crawler rules
│   └── sitemap.xml            # XML sitemap
├── src/
│   ├── main.jsx               # React entry point
│   ├── App.jsx                # Main app (state, logic, layout)
│   ├── index.css              # Design system + themes
│   └── components/
│       ├── SpeedGauge.jsx     # SVG speed gauge with ticks
│       ├── SpeedChart.jsx     # Canvas real-time speed graph
│       ├── SpeedTips.jsx      # Smart tips + stability score
│       └── TestResults.jsx    # Results grid + activity suitability
├── index.html                 # SEO meta + Schema.org structured data
├── vite.config.js             # Vite config with GitHub Pages base
└── package.json               # Scripts including deploy
```

---

## ⚙️ How It Works

```
┌─────────────┐   ┌──────────────┐   ┌─────────────┐   ┌──────────────┐
│  1. LATENCY  │──▶│  2. DOWNLOAD  │──▶│  3. UPLOAD   │──▶│  4. RESULTS  │
│  8 pings     │   │  4 parallel   │   │  Calibrated  │   │  Rating      │
│  Remove top  │   │  CDN fetches  │   │  simulation  │   │  Tips        │
│  & bottom    │   │  Streams API  │   │  Based on DL │   │  Stability   │
└─────────────┘   └──────────────┘   └─────────────┘   └──────────────┘
```

1. **Latency** — 8 requests to Google's favicon, sorted, highest & lowest removed, averaged
2. **Download** — 4 large images fetched in parallel from Unsplash CDN, bytes tracked via Streams API
3. **Upload** — Calibrated simulation using measured download speed and connection characteristics
4. **Analysis** — Speed rating, activity suitability check, stability score, and personalized tips

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

```bash
# Fork the repo, then:
git checkout -b feature/amazing-feature
git commit -m 'Add amazing feature'
git push origin feature/amazing-feature
# Open a Pull Request
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ⚡ by TurboTest**

[Live Demo](https://dsingh92342.github.io/TurboTest/) · [Report Bug](https://github.com/dsingh92342/TurboTest/issues) · [Request Feature](https://github.com/dsingh92342/TurboTest/issues)

</div>
