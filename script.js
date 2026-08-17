const api = 'https://api.open-meteo.com/v1/forecast';

async function getWeatherInfo() {
  const params = new URLSearchParams();
  params.set('latitude', '6.4541');
  params.set('longitude', '3.3947');
  params.set('current', 'temperature_2m,relative_humidity_2m,wind_speed_10m');

  try {
    const response = await fetch(`${api}?${params}`);

    if(!response.ok) {
      throw new Error('Something went wrong. Please try again later.');

    }

    const data = await response.json()

    console.log(data);
  } catch (error) {
    console.log(`An error occured: ${error}`)
  }
}



getWeatherInfo();