const date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
let currentDate;
let eventsAndHolidays;
const dateOptions = { year: "numeric", month: "long", day: "numeric" };

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
