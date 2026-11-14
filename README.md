<h1 align="center">🪐 OrbitBand – Astronaut Health Monitoring System</h1>

<div align="center">

An interactive astronaut health monitoring prototype designed for deep-space missions, helping monitor vital indicators, visualize health trends, and assess crew readiness during long-duration spaceflight.

🚀 **Focus:** Monitor • Analyze • Predict • Protect
Live Demo : https://orbit-band.vercel.app/

![NASA](https://img.shields.io/badge/NASA-Space%20Apps%20Challenge-blue?style=for-the-badge&logo=nasa&logoColor=white)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-Build%20Tool-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-Data%20Visualization-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Offline%20Ready-success?style=for-the-badge)

</div>

---

## 🎯 Overview

**OrbitBand** is an astronaut health monitoring prototype developed for the **NASA Space Apps Challenge**, focusing on the challenges of maintaining crew health during long-duration deep-space missions.

The application provides an interactive health monitoring interface that visualizes important physiological indicators, tracks health trends, and evaluates astronaut readiness. It features a visual body monitoring system covering different health zones, including the heart, bones and muscles, brain, and immune system.

OrbitBand also incorporates emergency response guidance, simulated mission scenarios, radiation exposure projections, and explainable readiness scores. Its offline-capable Progressive Web App (PWA) architecture allows the application to remain accessible without a continuous internet connection.

Built using **React, Vite, and Chart.js**, OrbitBand demonstrates how health data visualization, rule-based analysis, and interactive monitoring tools can support astronaut health management in challenging space environments.

---

## ✨ Key Features

🪐 **OrbitSky Visualization** with an animated canvas particle environment representing the space journey.

🫀 **Interactive Body Monitoring** with clickable SVG body zones covering Heart, Bones/Muscle, Brain, and Immune systems.

📊 **Health Measurement Guide** explaining each indicator, its significance, and recommended actions.

🚨 **Emergency Response Mode** featuring step-by-step collapse scenarios and emergency guidance.

⏱️ **CPR Metronome** with a 110 BPM audio metronome and a two-minute rescuer rotation timer.

📈 **Health Trend Analysis** using seven-day Chart.js graphs with status-coloured data points.

☢️ **Radiation Monitoring** with radiation exposure trends and projected career-limit estimates.

🎛️ **Mission Control Dashboard** with simulated scenarios such as normal conditions, poor sleep, radiation storms, and cabin air problems.

🧠 **Astronaut Readiness Score** with explainable score changes and a 14-day personal baseline comparison.

📋 **Flight Surgeon Summary** generating a ready-to-send emergency report with vital readings and completed response steps.

🌙 **Accessibility Controls** with Night Mode and Contrast Mode.

📱 **Progressive Web App (PWA)** with offline functionality through a manifest and service worker.

💾 **Local-First Architecture** without requiring a backend or user login.

---

## 🧠 How It Works

1. **Health Monitoring:** The application displays simulated astronaut health measurements and physiological indicators.

2. **Body Zone Visualization:** Users can interact with different body regions to inspect their health status.

3. **Status Evaluation:** A shared rules engine evaluates measurements and assigns corresponding health status indicators.

4. **Scenario Simulation:** Mission Control allows users to simulate different mission conditions, including poor sleep, radiation storms, and cabin air problems.

5. **Readiness Assessment:** The system calculates an explainable readiness score using health indicators and baseline comparisons.

6. **Trend Analysis:** Chart.js visualizes seven-day health trends and highlights persistent concerns.

7. **Radiation Projection:** Radiation trends are used to display projected exposure against configured career-limit values.

8. **Emergency Response:** Users can enter Emergency Mode to follow a step-by-step response scenario, use the CPR metronome, and manage rescuer rotation.

9. **Medical Summary:** The application generates a flight-surgeon summary containing vital readings and completed emergency steps.

---

## 🫀 Health Monitoring System

OrbitBand organizes health indicators into four major body zones:

- ❤️ **Heart:** Cardiovascular health indicators.
- 🦴 **Bones & Muscle:** Musculoskeletal health monitoring.
- 🧠 **Brain:** Neurological and cognitive health indicators.
- 🛡️ **Immune System:** Immune health and radiation-related concerns.

Each body zone receives a status based on the application's shared `getStatus()` rules engine.

The measurement guide provides:

- Explanation of each health indicator.
- Why the measurement matters.
- Recommended actions based on its status.
- A live value tester for experimenting with measurements.

**Note:** All measurements and health ranges are demonstration values, not validated medical reference ranges.

---

## 🚨 Emergency Response Mode

OrbitBand includes an interactive emergency mode designed to demonstrate how astronauts could follow structured response guidance during an onboard medical emergency.

### Key Components

- Step-by-step collapse response scenario.
- Responsiveness and breathing assessment guidance.
- CPR-related step progression.
- 110 BPM Web Audio metronome.
- Two-minute rescuer rotation timer.
- Speech synthesis for spoken guidance.
- Flight-surgeon summary generation.
- Copyable emergency report that works offline.

The emergency interface demonstrates how structured guidance and communication tools could support crew coordination during critical situations.

---

## 📊 Health Trends & Mission Readiness

### Trend Charts

The application uses **Chart.js** to display seven-day health trends.

Features include:

- Status-coloured chart points.
- Persistent-concern alerts.
- Radiation exposure visualization.
- Career-limit projection.
- Historical measurement comparison.

### Readiness Score

The readiness score provides an explainable assessment rather than displaying only a numerical result.

For example:

```text
Readiness Score

Sleep Impact:       -12
Radiation Impact:    -5

Total Score Change: -17
```

The application also compares current measurements against a 14-day personal baseline to demonstrate changes in astronaut health readiness.

---

## 🎛️ Mission Control

The Mission Control drawer allows users to explore different simulated mission conditions and observe how the monitoring system responds.

### Available Scenarios

- 🟢 **Normal:** Standard simulated health conditions.
- 😴 **Poor Sleep:** Demonstrates the effects of inadequate rest.
- ☢️ **Radiation Storm:** Simulates increased radiation exposure and immune-system concerns.
- 🌫️ **Cabin Air Problem:** Simulates environmental changes, including reduced SpO2 and elevated temperature.

These scenarios demonstrate how changes in mission conditions can influence health indicators, body-zone status, and overall readiness scores.

---

## 🛠 Technology Stack

- **Frontend:** React
- **Build Tool:** Vite
- **Programming Language:** JavaScript
- **Styling:** CSS
- **Data Visualization:** Chart.js
- **Graphics:** HTML Canvas and SVG
- **Audio:** Web Audio API
- **Speech:** Speech Synthesis API
- **Offline Support:** Progressive Web App (PWA)
- **PWA Integration:** vite-plugin-pwa
- **Storage:** Browser-based local persistence
- **Architecture:** Frontend-only application

**Backend:** Not required  
**Authentication:** No login required  
**Offline Support:** Available through PWA functionality after the application has been installed and its resources cached.

---

## 🚀 Installation & Setup

### Prerequisites

- Node.js
- npm
- Modern web browser
- Git

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd orbitband
```

Replace `<your-repository-url>` with the actual repository URL.

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Development Server

```bash
npm run dev
```

Open the local URL displayed in the terminal.

### 4. Production Build

```bash
npm run build
```

### 5. Preview Production Build

```bash
npm run preview
```

---

## 🎬 2-Minute Demo Walkthrough – "Day 180"

### 1. Welcome Aboard (0:00)

- Open the application.
- View the welcome screen and animated OrbitSky particle environment.
- Introduce the concept of monitoring astronaut health during a deep-space journey.

### 2. Body Monitoring (0:15)

- Click Begin.
- Open the interactive body figure.
- Select the Heart zone.
- Demonstrate the health status and sample heart rate of 74 BPM.

### 3. Radiation Storm (0:30)

- Open Mission Control.
- Select the Radiation Storm scenario.
- Observe the Immune zone changing to red.
- Demonstrate the readiness score reduction and its explanations.

### 4. Health Trends (0:45)

- Navigate to Trends.
- Show the radiation exposure chart.
- Demonstrate persistent-concern alerts and career-limit projection.

### 5. Cabin Air Problem (1:00)

- Switch the scenario to Cabin Air Problem.
- Observe the simulated SpO2 reduction to 91% and temperature increase to 37.8.
- Show the corresponding Brain and Immune status changes.

### 6. Emergency Mode (1:15)

- Activate the Emergency button.
- Demonstrate the step-by-step collapse response.
- Advance to the CPR step.
- Show the 110 BPM metronome and rescuer rotation timer.

### 7. Flight Surgeon Summary (1:35)

- Open Contact Flight Surgeon.
- Generate a summary containing vital readings and completed steps.
- Demonstrate the copy functionality, including offline operation.

### 8. Accessibility & About (1:45)

- Toggle Night Mode and Contrast Mode.
- Open the About section.
- Show the NASA HRP five hazards and NASA-STD-3001 references.

### 9. Closing (2:00)

**"Simulated band, real logic. Every screen reads the same data through the same rules — that's what makes it trustworthy at 20 minutes from Earth."**

---

## 📱 Progressive Web App (PWA)

OrbitBand is designed as an installable Progressive Web App.

### Features

- Installable application experience.
- Web App Manifest.
- Service worker integration.
- Offline access to cached application resources.
- No backend or login requirement.

The offline functionality helps demonstrate how a monitoring interface could remain accessible in environments with limited connectivity.

---

## 🎓 Learning Outcomes

🧠 Understanding health monitoring concepts for long-duration space missions.

⚛️ Building interactive interfaces using React.

📊 Visualizing health measurements and trends using Chart.js.

🎨 Working with SVG and Canvas-based visualizations.

⚙️ Implementing rule-based status evaluation and explainable scoring.

🚨 Designing interactive emergency response workflows.

🔊 Exploring browser audio and speech synthesis APIs.

📱 Developing installable and offline-capable Progressive Web Applications.

🌌 Exploring the challenges of astronaut health monitoring in deep-space environments.

---

## 🚀 Future Enhancements

⌚ Integration with wearable health monitoring devices.

📡 Real-time health data collection from connected sensors.

🤖 AI-assisted health trend analysis and anomaly detection.

📈 More advanced predictive health monitoring.

🛰️ Integration with simulated spacecraft telemetry.

🔐 Secure health data management and access controls.

🧑‍🚀 Multi-astronaut crew monitoring and comparison.

📊 Expanded mission health analytics and reporting.

---

## ⚠️ Disclaimer

OrbitBand is a prototype developed for demonstration purposes as part of the NASA Space Apps Challenge.

All health measurements, ranges, scenarios, and readiness calculations are simulated demonstration values. They are not medically validated and should not be used for actual diagnosis, treatment, or emergency medical decision-making.

---

## 👤 Creator

**Bhavith Madhav**

*Creator of OrbitBand – Astronaut Health Monitoring System*

---

<div align="center">

**Exploring the future of astronaut health monitoring.**

*Built for the challenges of life beyond Earth.*

</div>
