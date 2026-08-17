const weatherApi = 'https://api.open-meteo.com/v1/forecast';
const geoLocationApi = 'https://geocoding-api.open-meteo.com/v1/search';

// ====================================
// DOM Structures
// ====================================
const requestedLocation = document.querySelector('#location');
const searchButton = document.querySelector('#search');




// ====================================
// Functions
// ====================================

// Weather function
async function getWeatherInfo(latitude, longitude) {
  const params = new URLSearchParams();
  params.set('latitude', latitude);
  params.set('longitude', longitude);
  params.set('current', 'temperature_2m,relative_humidity_2m,wind_speed_10m');

  try {
    const response = await fetch(`${weatherApi}?${params}`);

    if(!response.ok) {
      throw new Error('Something went wrong. Please try again later.');

    }

    const data = await response.json()

    console.log(data);
  } catch (error) {
    console.log(`An error occured: ${error}`);
  }
}


// Location function
searchButton.addEventListener('click', getLocation);

async function getLocation() {

  const params = new URLSearchParams();
  params.set('name', requestedLocation.value)
  
  try {
    const response = await fetch(`${geoLocationApi}?${params}`);

    if(!response.ok){
      throw new Error('Something went wrong. Please try again later.');
    }

    const data = await response.json();

    latitude = data.results[0].latitude;
    longitude = data.results[0].longitude;

    console.log(data)
    console.log(data.results[0].latitude)
    console.log(data.results[0].longitude)

    getWeatherInfo(data.results[0].latitude, data.results[0].longitude);

  } catch (error) {
    console.log(`An error occured: ${error}`);
  }

}
