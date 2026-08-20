# 🌦️ AETHERIS

> **Discover information about the world around you.**

AETHERIS is a responsive weather and location explorer built with vanilla HTML, CSS, and JavaScript. It uses the **Open-Meteo APIs** to search for cities and retrieve real-time weather and location information.

## ✨ Features

* 🔎 **City Search** — Search for cities using live location suggestions.
* 🌡️ **Current Weather** — View temperature and apparent temperature.
* 💧 **Humidity & Dew Point** — Display current humidity and dew point.
* 💨 **Wind Information** — View wind speed and direction.
* 📊 **Atmospheric Data** — View pressure and visibility.
* 📍 **Location Information** — Display coordinates and elevation.
* 🌍 **Country & Region** — Display the selected city, country, and timezone.
* 👥 **Demographics** — Display available population information.
* 🎥 **Dynamic Backgrounds** — Weather-themed background videos create a more immersive experience.
* ⏳ **Loading States** — Visual feedback is provided while information is being retrieved.
* 📱 **Responsive Design** — Designed to work across desktop and mobile screen sizes.

## 🛠️ Technologies

### Frontend

* HTML5
* CSS3
* JavaScript (ES6+)

### APIs

* [Open-Meteo Weather API](https://open-meteo.com/)
* [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)

### Deployment & Tools

* Git
* GitHub
* Render

## 🔄 How It Works

AETHERIS uses two Open-Meteo APIs to retrieve the information displayed on the page.

### 1. Search for a city

When the user types into the search field, AETHERIS sends the search query to the Open-Meteo Geocoding API.

The API returns information such as:

* City name
* Country
* Latitude
* Longitude
* Elevation
* Population

The results are then displayed as interactive suggestions.

### 2. Select a location

When a location is selected, its latitude and longitude are passed to the weather function.

```text
City Search
     ↓
Geocoding API
     ↓
Location Data
     ↓
Latitude + Longitude
     ↓
Weather API
     ↓
Current Weather Data
     ↓
Update the UI
```

### 3. Display weather information

The coordinates are sent to the Open-Meteo Weather API, which returns the current weather conditions.

AETHERIS then updates the interface with the retrieved information.

## 📂 Project Structure

```text
AETHERIS/
│
├── public/
|   ├── images/
│   ├── cloudy.mp4
│   ├── rain.mp4
│   ├── storm.mp4
│   └── sunny.mp4
│
├── index.html
├── style.css
├── responsive.css
├── script.js
└── README.md
```

## 🚀 Getting Started

### Clone the repository

```bash
git clone https://github.com/John-2TB/weather-api.git
```

### Navigate into the project

```bash
cd weather-api
```

### Run the project

Because AETHERIS is a vanilla HTML/CSS/JavaScript project, no build process or package installation is required.

You can open `index.html` directly in your browser or use a development server such as **VS Code Live Server**.

## 🌐 Live Demo

**Live Site:**
https://aetheris-dp98.onrender.com/

## 📸 Preview

Add screenshots of AETHERIS here.

![Preview-1](public/images/aetheris-preview-1.png)
![Preview-2](public/images/aetheris-preview-2.png)
![Preview-3](public/images/aetheris-preview-3.png)

## 🧠 What I Learned

Building AETHERIS helped me strengthen my understanding of:

* Working with external REST APIs
* `fetch()` and asynchronous JavaScript
* `async/await`
* Handling API responses
* Using `URLSearchParams`
* Working with JSON data
* Dynamically creating DOM elements
* Event listeners
* Search/autocomplete interfaces
* Loading states
* Responsive CSS
* Working with HTML5 video
* Deploying a frontend project

One of the most important concepts I practiced was using the result of one API request to make another API request.

The geocoding API provides the coordinates of a city, and those coordinates are then used to request its weather information.

## 🔮 Future Improvements

Some features I would like to explore in future versions include:

* 🌤️ Weather condition detection and smarter background selection
* 📅 Multi-day weather forecasts
* 🌙 Dark/light theme support
* 📌 Recently searched locations
* ⭐ Favorite locations
* 🗺️ Interactive maps
* 🌡️ More weather statistics
* 🕐 Local time for the selected location
* 🎨 More advanced weather animations

## 👨‍💻 Author

**John Koto**

Frontend Developer | JavaScript Developer

* GitHub: https://github.com/John-2TB
* LinkedIn: https://linkedin.com/in/john-koto

---

⭐ If you find this project interesting, consider giving the repository a star!

Built with ❤️, JavaScript, and a lot of debugging. 🚀
