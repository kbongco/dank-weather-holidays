// import WEATHER_API_KEY from './apikey.js';

const date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
let currentDate;
let currentMonth;
let eventsAndHolidays;
let iconCode;

const dateOptions = { year: "numeric", month: "long", day: "numeric" };
const the12Seasons = ['Winter', 'Fools Spring', 'Second Winter', 'Spring of Deception', 'Third Winter', 'The Pollening', 'Actual Spring', 'Summer', 'Hells Front Porch', 'False Fall', 'Second Summer', 'Actual Fall']
// Figure out how to handle Southern Hemisphere Countries 
// Cannot find API that would list countries/Continents in Southern Hemisphere 
// Decided to store it in an array which would contain all the countries there :) 
// Figure out how to handle countries that only have wet and dry season? 

const southernHemisphere = ['Angola', 'Botswana', 'Burundi', 'Eswatini', 'Lesotho', 'Malawi', 'Mozambique', 'Namibia', 'Rwanda', 'South Africa', 'Tanzania', 'Zambia', 'Zimbabwe', 'Democratic Republic of Congo', 'Gabon', 'Republic of the Congo', 'Argentina', 'Bolivia', 'Chile', 'Paraguay', 'Peru', 'Uruguay', 'Brazil', 'Ecuador', 'Antarctica', 'Papua New Guinea', 'Australia', 'New Zealand'];



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
  currentDate = `${monthName} ${day} ${year}`
  console.log(currentMonth);
  return currentDate;
}
function getHolidays() {
  fetch("./pop-culture.json")
    .then((response) => response.json())
    .then((data) => {
      eventsAndHolidays = data;
      const text = matchByDate();
      console.log(text);
    }).then(() => {
      const holidayText = matchByDate();
      document.getElementById("holiday-text").textContent = holidayText;
    })
    .catch((error) => {
      console.error(error);
    });
}


function getWeather() {
  let cityInput = document.getElementById('city-search').value;
  const getCityAPI = `http://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&limit=1&appid=${WEATHER_API_KEY}`;

  fetch(getCityAPI)
    .then((res) => {
      return res.json(); 
    })
    .then((data) => {
      if (data.length > 0) {
        const lat = data[0].lat;
        const lon = data[0].lon;
        const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${WEATHER_API_KEY}`;
        return fetch(weatherApiUrl);
      } else {
        throw new Error('The city does not exist...');
      }
    })
    .then((response) => {
      return response.json(); 
    })
    .then((data) => {
      iconCode = data.weather[0].icon;
      const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
      console.log(data);
      const funnyQuote = funnyWeatherQuotes(data.main.temp, data.main.feels_like);
      console.log(data.weather[0].main);
      console.log(data.weather[0].icon);
      document.getElementById("current-weather").textContent = data.weather[0].main;
      document.getElementById("current-feels").textContent = data.main.feels_like;
      document.getElementById("current-temperature").textContent = data.main.temp;
      document.getElementById("quote-text").textContent = funnyQuote;
      const weatherIcon = document.getElementById("regular-weather-icon")
      weatherIcon.src = iconUrl;
      const resultContainer = document.getElementById("weather-information");
      const additionalContainer = document.getElementById("additional-information");
      additionalContainer.classList.remove("hidden");
      resultContainer.classList.remove("hidden");
      specialIcon(data.main.temp);
      aboveBelowAverage(data.main.temp, currentMonth);
    })
    .catch((error) => {
      console.error(error);
    });
}

// feels_like
// : 
// 29.21
// humidity
// : 
// 48
// pressure
// : 
// 1019
// temp
// : 
// 36.95
// temp_max
// : 
// 39.96
// temp_min
// : 
// 33.91

// weather
// : 
// Array(1)
// 0
// : 
// description
// : 
// "broken clouds"
// icon
// : 
// "04n"
// id
// : 
// 803
// main
// : 
// "Clouds"

// Function to display icons, special 
// This takes in temperature if 90C or feels like 90 or more show fire 
// If temperature is lower than 30 or feels like 30, throw in brick icon

function specialIcon(temperature) {
  if (temperature > 80) {
    console.log(temperature);
    weatherIcon.classList.add('fas', 'fa-fire');
  } else if (temperature < 32) {
    weatherIcon.classList.add('fas', 'fa-trowel-bricks')
  } 
}

function displaySznInfo(temperature, currentMonth, the12Seasons) {
  if (currentMonth === 'January' || currentMonth === 'February' || currentMonth === 'December') {
    return the12Seasons[0];
  } else if ((currentMonth === 'January' && temperature > 40 ) || (currentMonth === 'February' && temperature > 40)) {
    return the12Seasons[1];
  } else if ((currentMonth === 'March' && temperature < 40) || (currentMonth === 'April' && temperature < 40)) {
    return the12Seasons[2];
  } else if (currentMonth === 'March' && temperature > 40) {
    return the12Seasons[3];
  } else if (currentMonth === 'March' && temperature < 40) {
    return the12Seasons[4];
  } else if (currentMonth === 'April') {
    return the12Seasons[5];
  } else if (currentMonth === 'April' || currentMonth === 'May') {
    return the12Seasons[6];
  } else if (currentMonth === 'June' || currentMonth === 'July' || currentMonth === 'August') {
    return the12Seasons[7];
  }
}

function funnyWeatherQuotes(temperature, feels_like) {
  if (temperature >= 90 || feels_like > 90) {
    return 'Bro, it\'s way too fcking hot. Remember to hydrate!';
  } else if (temperature >= 80 || feels_like > 80) {
    return 'It\'s getting hot in here, so take off all your clothes';
  } else if (temperature >= 70 || feels_like > 70) {
    return 'It\'s pretty nice out, maybe you should wear a light jacket or a hoodie?';
  } else if (temperature <= 40 || feels_like < 40) {
    return 'Yo, it\'s starting to get a little cold';
  } else if (temperature <= 30 || feels_like < 30) {
    return 'It\'s brick outside';
  } else if (temperature < 20 || feels_like < 20) {
    return 'Okay, it\'s way too fcking cold. Why are you out?';
  } else {
    return 'Nothing out of the ordinary here!';
  }
}

function aboveBelowAverage(temperature, currentMonth) {
  console.log(currentMonth);
  if (currentMonth === 'January' && temperature < 45) {
    console.log('Global warming is that you? ')
  }
}



function matchByDate() {
  const filteredEvents = eventsAndHolidays.popCultureHolidaysAndEvents.filter((event) => {
    return currentDate.includes(event.holidayDate);
  });
  return filteredEvents.length > 0
    ? filteredEvents.map(event => event.holidayName).join(', ')
    : 'There is no special holiday this time...';
}

function revengeOfTheFifth(currentDate) {
  if (currentDate.includes("May 5")) {
    document.body.style.backgroundColor = 'black';
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const todaysDate = getCurrentDate(day, month, year);
  
  
  document.getElementById("current-date").textContent = todaysDate;
  console.log(todaysDate);

  getHolidays();  
  revengeOfTheFifth(currentDate);
});
