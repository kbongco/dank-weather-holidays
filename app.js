require('dotenv').config();
import data from './pop-culture.json';
const date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
let currentDate;
let currentMonth;
let eventsAndHolidays;
let iconCode;

const weatherapiKey = process.env.API_KEY;

const dateOptions = { year: "numeric", month: "long", day: "numeric" };
const the12Seasons = [
  "Winter",
  "Fools Spring",
  "Second Winter",
  "Spring of Deception",
  "Third Winter",
  "The Pollening",
  "Actual Spring",
  "Summer",
  "Hells Front Porch",
  "False Fall",
  "Second Summer",
  "Actual Fall",
];
const dryAndWetTropics = [{
  dry: ['December', 'January', 'February', 'March', 'April', 'May'],
  wet: ['June', 'July', 'August', 'September', 'October', 'November']
}];
const winterOutfits = ['A jacket and a scarf might be nice', 'You need a jacket', 'Jacket, gloves, and a scarf', 'Wear some thermals too!']
const springOutfits = ['A hoodie or a light jacket'];
const summerOutfits = ['Whatever makes you happy', 'Some shorts and a tank', 'Gotta wear some shades with your outfit']
const fallOutfits = ['Shorts in the afternoon, jeans in the morning']

const southernHemisphereSzn = [{
  summer: ['December', 'January', 'February'],
  fall: ['March', 'April', 'May'],
  winter: ['June', 'July', 'August'],
  spring: ['September', 'Ocobter', 'November']

}]

function getCurrentDate(day, month, year) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthName = months[month - 1];
  currentMonth = monthName;
  currentDate = `${monthName} ${day} ${year}`;
  return currentDate;
}

function getHolidays() {
  eventsAndHolidays = data.popCultureHolidaysAndEvents;
  const holidayText = matchByDate();
  document.getElementById("holiday-text").textContent = holidayText;
}



window.getWeather = () => {
  let lat;
  let lon;
  let cityInput = document.getElementById("city-search").value;
  const getCityAPI = `http://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&limit=1&appid=${weatherapiKey}`;

  fetch(getCityAPI)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (data.length > 0) {
        lat = data[0].lat;
        lon = data[0].lon;
        const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherapiKey}`;
        const airQualityApiUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${weatherapiKey}`;

        return Promise.all([
          fetch(weatherApiUrl).then((response) => response.json()),
          fetch(airQualityApiUrl).then((response) => response.json()),
        ]);
      }
    })
    .then(([weatherData, airQualityData]) => {
      iconCode = weatherData.weather[0].icon;
      const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
      const weatherIcon = document.getElementById("regular-weather-icon")
      weatherIcon.src = iconUrl;
      document.getElementById("current-weather").textContent = `The current condition is: ${weatherData.weather[0].main}`;
      document.getElementById("current-feels").textContent = `Feels like: ${weatherData.main.feels_like}`;
      document.getElementById("current-temperature").textContent = `Current Temperature: ${weatherData.main.temp}`
      document.getElementById('airquality-card').textContent = returnAirQualityIndex(airQualityData.list[0].main.aqi);
      const resultContainer = document.getElementById("weather-information");
      const additionalContainer = document.getElementById(
        "additional-information"
      );
      const currentSeason = determineSeason(lat, currentMonth, weatherData, dryAndWetTropics, the12Seasons, southernHemisphereSzn)
      document.getElementById('current-season').textContent = currentSeason;
      additionalContainer.classList.remove("hidden");
      resultContainer.classList.remove("hidden");
      const funnyQuote = funnyWeatherQuotes(weatherData.main.temp, weatherData.main.feels_like);
      document.getElementById("quote-text").textContent = funnyQuote;
    })
    .catch((error) => {
      console.error(error);
    });
}

function selectOutfitBasedOnSzn(the12Seasons) {
  
}

function specialIcon(temperature) {
  if (temperature > 80) {
    weatherIcon.classList.add("fas", "fa-fire");
  } else if (temperature < 32) {
    weatherIcon.classList.add("fas", "fa-trowel-bricks");
  }
}

function displaySznInfo(temperature, currentMonth, the12Seasons) {
  if (
    currentMonth === "January" ||
    currentMonth === "February" ||
    currentMonth === "December"
  ) {
    return the12Seasons[0];
  } else if (
    (currentMonth === "January" && temperature > 50) ||
    (currentMonth === "February" && temperature > 50)
  ) {
    return the12Seasons[1];
  } else if (
    (currentMonth === "March" && temperature < 40) ||
    (currentMonth === "April" && temperature < 40)
  ) {
    return the12Seasons[2];
  } else if (currentMonth === "March" && temperature > 40) {
    return the12Seasons[3];
  } else if (currentMonth === "March" && temperature < 40) {
    return the12Seasons[4];
  } else if (currentMonth === "April") {
    return the12Seasons[5];
  } else if (currentMonth === "April" || currentMonth === "May") {
    return the12Seasons[6];
  } else if (
    currentMonth === "June" ||
    currentMonth === "July" ||
    currentMonth === "August"
  ) {
    return the12Seasons[7];
  }
}


function tropicSzn(lat, currentMonth, dryAndWetTropics) {
  if (lat < 23.5 && lat > -23.5) {
    const tropicsInfo = dryAndWetTropics[0];
    if (tropicsInfo.dry.includes(currentMonth)) {
      return 'dry';
    } else if (tropicsInfo.wet.includes(currentMonth)) {
      return 'wet';
    }
  } else {
    return 'notInTropics';
  }
}

function checkSouthernHemisphere(lat, currentMonth, southernHemisphereSzn) {
  if (lat < 0) {
    const southernHemisphereSzns = southernHemisphereSzn[0];

    for (const season in southernHemisphereSzns) {
      if (southernHemisphereSzns[season].includes(currentMonth)) {
        return season;
      }
    }
  }
}

function funnyWeatherQuotes(temperature, feels_like) {
  if (temperature >= 90 && feels_like > 90) {
    return "Bro, it's way too fcking hot. Remember to hydrate!";
  } else if (temperature >= 80 && feels_like > 80) {
    return "It's getting hot in here, so take off all your clothes";
  } else if (temperature >= 70 && feels_like > 70) {
    return "It's pretty nice out";
  } else if (temperature <= 30 || feels_like < 30) {
    return "It's brick outside";
  } else if (temperature < 20 && feels_like < 20) {
    return "Okay, it's way too fcking cold. Why are you out?";
  } else {
    return "Nothing out of the ordinary here!";
  }
}

function determineSeason(lat, currentMonth, weatherData, dryAndWetTropics, the12Seasons, southernHemisphereSzn) {
  // Check if the location is in the tropics
  if (lat < 23.5 && lat > -23.5) {
    for (const tropicSeason in dryAndWetTropics[0]) {
      if (dryAndWetTropics[0][tropicSeason].includes(currentMonth)) {
        return tropicSeason;
      }
    }
  }

  // Check if the location is in the Southern Hemisphere
  if (lat < 0) {
    const southernHemisphereSzns = southernHemisphereSzn[0];
    for (const southernSeason in southernHemisphereSzns) {
      if (southernHemisphereSzns[southernSeason].includes(currentMonth)) {
        return southernSeason;
      }
    }
  }

  // Default to the 12-season check
  for (let i = 0; i < the12Seasons.length; i++) {
    if (displaySznInfo(weatherData.weather[0].main, currentMonth, the12Seasons) === the12Seasons[i]) {
      return the12Seasons[i];
    }
  }
}

function returnAirQualityIndex(aqi) {
  const aqiReadings = new Map([
    [1, 'Good'],
    [2, 'Fair'],
    [3, 'Moderate'],
    [4, 'Poor'],
    [5, 'Very Poor']
  ]);

  if (aqiReadings.has(aqi)) {
    const description = aqiReadings.get(aqi);
    return `${aqi} -- ${description}`;
  } else {
    return "This is not valid";
  }
}


function matchByDate() {
  const filteredEvents = eventsAndHolidays.filter(
    (event) => {
      return currentDate.includes(event.holidayDate);
    }
  );
  return filteredEvents.length > 0
    ? filteredEvents.map((event) => event.holidayName).join(", ")
    : "There is no special holiday this time...";
}

function revengeOfTheFifth(currentDate) {
  if (currentDate.includes("May 5")) {
    document.body.style.backgroundColor = "black";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const todaysDate = getCurrentDate(day, month, year);

  document.getElementById("current-date").textContent = todaysDate;

  getHolidays();
  revengeOfTheFifth(currentDate);
});
