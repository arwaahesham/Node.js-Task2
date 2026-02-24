require("dotenv").config();
const axios = require("axios");
const readline = require("readline");

const API_KEY = process.env.API_KEY;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Enter country name: ", async (country) => {
  try {
    if (!API_KEY) {
      console.log("API Key is missing. Check your .env file.");
      rl.close();
      return;
    }

    //Geocoding API
    const geoResponse = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${country}&limit=1&appid=${API_KEY}`
    );

    if (geoResponse.data.length === 0) {
      console.log("Country not found.");
      rl.close();
      return;
    }

    const { lat, lon, name } = geoResponse.data[0];

    //Weather API
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    const temperature = weatherResponse.data.main.temp;

    //Display Data
    console.log("\n Country Data:");
    console.log(`Country: ${name}`);
    console.log(`Latitude: ${lat}`);
    console.log(`Longitude: ${lon}`);
    console.log(`Temperature: ${temperature}°C`);

  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        console.log("Invalid API Key.");
      } else {
        console.log("API Error:", error.response.status);
      }
    } else if (error.request) {
      console.log("Network Error. Please check your internet connection.");
    } else {
      console.log("Unexpected Error:", error.message);
    }
  } finally {
    rl.close();
  }
});