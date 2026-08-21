const weatherApi = 'https://api.open-meteo.com/v1/forecast';
const geoLocationApi = 'https://geocoding-api.open-meteo.com/v1/search';
const reverseGeoApi = 'https://nominatim.openstreetmap.org/reverse';

// ====================================
// DOM Structures
// ====================================
const main = document.querySelector('.main');
const headerVideo = document.querySelector('#header-video');
const requestedLocation = document.querySelector('#requested-location');
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
const cityLocation = document.querySelector('#location');
const loaderContainer = document.querySelector('.loader-container');
const welcomeMessage = document.querySelector('.welcome-message');


let searchResults = [];

headerVideo.muted = true;
headerVideo.playsInline = true;

headerVideo.play()
  .then(() => {
    console.log('Video started automatically');
  })
  .catch(error => {
    console.log('Autoplay failed:', error);
  });

// ====================================
// Event Listner
// ====================================
requestedLocation.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter'){

        if (!searchResults.length) {
          return;
        }

        suggestions.innerHTML = ``;
        suggestions.style.display = 'none';
        getLocationInsights(searchResults[0]);
        console.log(`${e.key} was pressed`)
      }
    });

requestedLocation.addEventListener('input', () => {
  console.log(`${requestedLocation.value}`)
  searchLocation();
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
      if (response.status === 400){
        throw new Error('The requested place is invalid.')
      } else if (response.status === 403){
        throw new Error('Unable to access weather data right now.')
      } else if (response.status === 429){
        throw new Error('Too many requests. Please try again later.')
      } else if(response.status >= 500){
        throw new Error('Open Meteo Geocoding server is having trouble right now. Please try again later.')
      }

      throw new Error('Something went wrong. Please try again later.');
    }

    const data = await response.json();

    if(!data.results || data.results.length === 0) {
      welcomeMessage.innerHTML = `
        <h2>No location found</h2>
      `;

      locationDisplay.style.display = 'none'
      document.querySelector('.info-section').style.display = 'none';

      searchResults = [];

      return;
    }

    searchResults = data.results;

    suggestions.innerHTML = ``;
    suggestions.style.display = 'block';
    suggestions.style.width = '45%';

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
    // if (error instanceof TypeError) {
    //   suggestions.textContent =
    //     '⚠️ Unable to connect. Please check your internet connection and try again.';
    //   suggestions.style.width = '60%';

    //   return;
    // }

    console.log(`An error occured: ${error}`);

    showError(
      error.message || 'Unable to search for that location.'
    );
  }
}

// Location function
async function getLocationInsights(data) {
  loaderContainer.style.display = 'flex';

  try {

    welcomeMessage.style.display = 'none';
    locationDisplay.style.display = 'block';
    document.querySelector('.info-section').style.display = 'grid';

    const locationName = data.name || 'Unknown location';
    const countryName = data.country || 'Unknown country';

    locationDisplay.innerHTML = `
      <span></span> ${locationName}, ${countryName}
    `;
    coordinatesDisplay.innerHTML = `${data.latitude}<sup>&deg;</sup>, ${data.longitude}<sup>&deg;</sup>`;
    elevationDisplay.textContent = `Elevation: ${data.elevation ?? 'Unavailable'}`;
    cityLocation.textContent = `${data.name}, ${data.country}`;
    population.textContent = `Population: ${data.population ?? 'Unavailable'}`

    await getWeatherInfo(data.latitude, data.longitude)

  } catch (error) {
    console.log(`An error occured: ${error}`);

    showError(error.message);
  } finally {
    loaderContainer.style.display = 'none';
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
      if (response.status === 400) {
        throw new Error('Invalid location coordinates.');
      }

      if (response.status === 429) {
        throw new Error(
          'Too many weather requests. Please try again later.'
        );
      }

      if (response.status >= 500) {
        throw new Error(
          'The weather service is currently unavailable.'
        );
      }

      throw new Error('Something went wrong. Please try again later.');
    };

    const data = await response.json()

    if(!data.current) {
      throw new Error('Weather information is unavailabe for this locatin.')
    }

    temperatureDisplay.innerHTML = `${data.current.temperature_2m}<sup>&deg;C</sup>`;
    apparentTemperatureDisplay.innerHTML = `Feels like ${data.current.apparent_temperature}<sup>&deg;C</sup>`;
    humidityDisplay.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.6)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-droplet-icon lucide-droplet"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg> ${data.current.relative_humidity_2m}%`;
    dewPointDisplay.innerHTML = `${data.current.dew_point_2m}<sup>&deg;C</sup>`;
    windDisplay.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wind-icon lucide-wind"><path d="M12.8 19.6A2 2 0 1 0 14 16H2"/><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"/><path d="M9.8 4.4A2 2 0 1 1 11 8H2"/></svg> ${data.current.wind_speed_10m} km/h`;
    windDirectionDisplay.innerHTML = `${data.current.wind_direction_10m}<sup>&deg;</sup>`;
    pressureDisplay.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-gauge-icon lucide-gauge"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg> ${data.current.pressure_msl} hPa`;
    visibilityDisplay.textContent = `${data.current.visibility / 1000} Km`;

    timezoneDisplay.textContent = `${data.timezone}`

  } catch (error) {
    console.log(`An error occured: ${error}`);
    console.error(`Weather error: ${error}`);

    throw error;
  }
}

// Reverse Geocoding API function
async function reverseGeocoding(latitude, longitude) {
  const params = new URLSearchParams();
  params.set('lat', latitude);
  params.set('lon', longitude);
  params.set('format', 'jsonv2');
  params.set('addressdetails', '1');

  try {
    // ====================================
    // Nominatim Reverse Geocoding
    // ====================================

    const response = await fetch(`${reverseGeoApi}?${params}`);
  
    if(!response.ok){
      throw new Error('Reverse geocoding failed.')
    }

    const data = await response.json();

    console.log('Reverse Geocoding')
    console.log(data);

    const city = 
    data.address.city ||
    data.address.town ||
    data.address.village ||
    data.address.municipality;

    if (!city){
      throw new Error('Unable to determine the name of your location.')
    }
    if (!data.address.country_code){
      throw new Error('Unable to determine your country.')
    }

    // ====================================
    // Open-Meteo Geocoding
    // ====================================
    const locationParam = new URLSearchParams();
    locationParam.set('name', city);
    locationParam.set('countryCode', data.address.country_code.toUpperCase());

    const locationResponse = await fetch(`${geoLocationApi}?${locationParam}`);

    if(!locationResponse.ok){
      throw new Error('GeoLocation API failed');
    }

    const locationData = await locationResponse.json();
    console.log(locationData)

    if(!locationData.results || locationData.results.length === 0) {
      throw new Error(`Weather data for ${city}, ${data.address.country} is unavailable.`)
    };

    await getLocationInsights(locationData.results[0])

  } catch (error) {
    console.log(`An error occured: ${error}`);
    console.error(`An error occured: ${error}`);

    showError(error.message);
  }
}


navigator.geolocation.getCurrentPosition(
  (position) => {
    // locationDisplay.style.display = 'block';
    // welcomeMessage.style.display = 'none';
    // document.querySelector('.info-section').style.display = 'grid';

    reverseGeocoding(position.coords.latitude, position.coords.longitude);

  }, 
  (error) => {
    console.error(`Geolocation error: ${error}`);

     if (error.code === 1) {
      showError(
        'Location permission was denied. Search for a city manually.'
      );

    } else if (error.code === 2) {
      showError(
        'Your location could not be determined. Search for a city manually.'
      );

    } else if (error.code === 3) {
      showError(
        'Location request timed out. Search for a city manually.'
      );

    } else {
      showError(
        'Unable to determine your location. Search for a city manually.'
      );
    }
  }
);


// Error funtion
function showError(message) {
  console.error(message);

  loaderContainer.style.display = 'none';

  welcomeMessage.style.display = 'block';
  welcomeMessage.innerHTML = `
    <h2>Something went wrong</h2>
    <p>${message}</p>
  `;

  locationDisplay.style.display = 'none';
  document.querySelector('.info-section').style.display = 'none';
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
    // console.log(`Switched to: ${videoSrc[currentIndex]}`);

    currentIndex = (currentIndex + 1) % videoSrc.length;

  }
}

setInterval(changeVideo, 5000);
