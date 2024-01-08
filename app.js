// import WEATHER_API_KEY from './apikey.js';

const date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
let currentDate;
let eventsAndHolidays;
const dateOptions = { year: "numeric", month: "long", day: "numeric" };
const the12Seasons = ['Winter', 'Fools Spring', 'Second Winter', 'Spring of Deception', 'Third Winter', 'The Pollening', 'Actual Spring', 'Summer', 'Hells Front Porch', 'False Fall', 'Second Summer', 'Actual Fall']

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
  currentDate = `${monthName} ${day} ${year}`

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
        const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`;
        return fetch(weatherApiUrl);
      } else {
        throw new Error('The city does not exist...');
      }
    })
    .then((response) => {
      return response.json(); 
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });
}


function matchByDate() {
  const filteredEvents = eventsAndHolidays.popCultureHolidaysAndEvents.filter((event) => {
    return currentDate.includes(event.holidayDate);
  });
  return filteredEvents.length > 0
    ? filteredEvents.map(event => event.holidayName).join(', ')
    : 'There is no special holiday this time...';
}

document.addEventListener("DOMContentLoaded", () => {
  const todaysDate = getCurrentDate(day, month, year);
  
  document.getElementById("current-date").textContent = todaysDate;
  console.log(todaysDate);

  getHolidays();  
});
