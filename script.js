const weatherApi = 'https://api.open-meteo.com/v1/forecast';
const geoLocationApi = 'https://geocoding-api.open-meteo.com/v1/search';

// ====================================
// DOM Structures
// ====================================
const main = document.querySelector('.main');
const headerVideo = document.querySelector('#header-video');
const requestedLocation = document.querySelector('#location');
const searchButton = document.querySelector('#search');
const temperatureDisplay = document.querySelector('#temperature');
const apparentTemperatureDisplay = document.querySelector('#apparent-temperature');
const humidityDisplay = document.querySelector('#humidity');
const dewPointDisplay = document.querySelector('#dew-point');
const windDisplay = document.querySelector('#wind');
const windDirectionDisplay = document.querySelector('#direction');
const pressureDisplay = document.querySelector('#pressure');
const visibilityDisplay = document.querySelector('#visibility');
const coordinatesDisplay = document.querySelector('#coordinates');
const elevationDisplay = document.querySelector('#elevation');
const timezoneDisplay = document.querySelector('#timezone');
const population = document.querySelector('#population');
const locationDisplay = document.querySelector('#locationDisplay');
const suggestions = document.querySelector('#suggestions');




// ====================================
// Event Listner
// ====================================
searchButton.addEventListener('click', getLocationInsights);

requestedLocation.addEventListener('input', () => {
  console.log(`${requestedLocation.value}`)
  searchLocation();
});

requestedLocation.addEventListener('keydown', (e) => {
  if(e.key === 'Enter'){
    searchLocation()
    // getLocationInsights();
    console.log(`${e.key} was pressed`)
  }
});


// ====================================
// Functions
// ====================================

// Search Function
async function searchLocation() {
  if(requestedLocation.value.trim() === ''){
    suggestions.innerHTML = ``;
    suggestions.style.display = 'none';
    return
  };

  const params = new URLSearchParams();
  params.set('name', requestedLocation.value);

  try {
    const response = await fetch(`${geoLocationApi}?${params}`);

    if(!response.ok){
      throw new Error('Something went wrong. Please try again later.');
    }

    const data = await response.json();

    suggestions.innerHTML = ``;
    suggestions.style.display = 'block';

    data.results.forEach((item) => {

      const div = document.createElement('div');

      div.innerHTML = `
      <h4>${item.name}</h4>
      <p>${item.country}</p>
      `;

      div.addEventListener('click', () => {
        requestedLocation.value = `${item.name}`
        suggestions.innerHTML = ``;
        getLocationInsights(item);
      });

      suggestions.appendChild(div);
    });
  } catch (error) {
    console.log(`An error occured: ${error}`);
  }
}

// Location function
async function getLocationInsights(data) {
  
  try {
    locationDisplay.innerHTML = `
      <span></span> ${data.name}, ${data.country}
    `;

    console.log(data.name);
    console.log(data.latitude);
    console.log(data.longitude);

    getWeatherInfo(data.latitude, data.longitude)

  } catch (error) {
    console.log(`An error occured: ${error}`);
  }
};

// Weather function
async function getWeatherInfo(latitude, longitude) {
  const params = new URLSearchParams();
  params.set('latitude', latitude);
  params.set('longitude', longitude);
  params.set('current', 'temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature,pressure_msl,dew_point_2m,visibility,wind_direction_10m');

  try {
    const response = await fetch(`${weatherApi}?${params}`);

    if(!response.ok) {
      throw new Error('Something went wrong. Please try again later.');

    }

    const data = await response.json()

    temperatureDisplay.innerHTML = `${data.current.temperature_2m}<sup>&deg;C</sup>`;
    apparentTemperatureDisplay.innerHTML = `Feels like ${data.current.apparent_temperature}<sup>&deg;C</sup>`;
    humidityDisplay.textContent = `${data.current.relative_humidity_2m}%`;
    dewPointDisplay.innerHTML = `${data.current.dew_point_2m}<sup>&deg;C</sup>`;
    windDisplay.textContent = `${data.current.wind_speed_10m} km/h`;
    windDirectionDisplay.innerHTML = `${data.current.wind_direction_10m}<sup>&deg;</sup>`;
    pressureDisplay.textContent = `${data.current.pressure_msl} hPa`;
    visibilityDisplay.textContent = `${data.current.visibility} m`;

  } catch (error) {
    console.log(`An error occured: ${error}`);
  }
}



// Change video function
const videoSrc = [
    './public/cloudy.mp4',
    './public/rain.mp4',
    './public/storm.mp4',
    './public/sunny.mp4'
  ];

  let currentIndex = 0;

function changeVideo(){

  if(headerVideo) {
    headerVideo.src = videoSrc[currentIndex];
    console.log(`Switched to: ${videoSrc[currentIndex]}`);

    currentIndex = (currentIndex + 1) % videoSrc.length;

  }
}

setInterval(changeVideo, 5000);
