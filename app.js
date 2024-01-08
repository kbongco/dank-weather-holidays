const date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };

function getCurrentDate(day, month, year) {
  return ` ${month}/${day}/${year}`
}



document.addEventListener('DOMContentLoaded', () => {
  const todaysDate = getCurrentDate(day, month, year)
  document.getElementById('current-date').textContent = todaysDate;
  console.log(todaysDate)
})

