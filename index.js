const CITIES_API = 'http://api.travelpayouts.com/data/ru/cities.json',
      PROXY = 'https://cors-anywhere.herokuapp.com/',
      PRICES_CALENDAR = 'http://api.travelpayouts.com/v1/prices/calendar',
      SERVER_URL = "https://vk-bot-learn.000webhostapp.com/aviasales-request.php",
      MAX_COUNT = 10;

const app = document.querySelector('#app');
const form = app.querySelector('.search-form');

let cities = [];
fetch(PROXY + CITIES_API)
  .then(response => response.json())
  .then(citiesJSON => cities = citiesJSON);


form.addEventListener('click', addMatchLists);


document.addEventListener('click', e => {
  let placesList = document.querySelector('.input .matches-list');

  if (e.target == form) {
    addMatchLists(e);
  }

  if ( 
    placesList && (
      !e.target.matches('#ticket-from') || 
      !e.target.matches('#ticket-to')
    )
  ) placesList.remove();
});


form.addEventListener('submit', e => {
  e.preventDefault();

  loadTickets(e);
});


function addMatchLists(e) {
  if ( 
    e.target.matches('#ticket-from') || 
    e.target.matches('#ticket-to') 
  ) {
    const inputContainer = e.target.parentElement;
    const inputElement = e.target;
    
    inputElement.addEventListener('keyup', e => {
      let input = e.target.value;
      const placesList = document.querySelector('.input .matches-list');   
      if (placesList) placesList.remove();

      if (input.length >= 3) {
        let matchedPlaces = cities
          .filter( city => {
            if (city.name) return city.name.startsWith(input, 0)
          })
          .map(place => {
            let element = document.createElement('li');
            element.textContent = place.name;
            return element;
          });

        const list = document.createElement('ul');
        list.classList.add('matches-list');
        inputContainer.append(list);

        matchedPlaces.forEach( place => list.append(place) );

        list.onclick = e => {
          const listItem = e.target.closest('li');
          if (listItem) inputElement.value = listItem.textContent;

          list.remove();
        }
      }
    })
  }
}


function loadTickets(event) {
  let cityFrom = form.querySelector('#ticket-from').value,
      cityTo = form.querySelector('#ticket-to').value,
      departDate = form.querySelector('#ticket-on').value;

  let cityFromCode = cities.find(city => {
    let cityName = city.name;

    if (cityName) {
      let isEqual = cityName.toLowerCase() == cityFrom.toLowerCase();
      return isEqual;
    }
    return false;
  }).code;

  let cityToCode = cities.find( city => {
    let cityName = city.name;

    if (cityName) {
      let isEqual = cityName.toLowerCase() == cityTo.toLowerCase();
      return isEqual;
    }
    return false;
  }).code;
  
  const requestUrl = 'http://min-prices.aviasales.ru/calendar_preload';

  let formData = {
    origin: cityFromCode,
    destination: cityToCode,
    depart_date: departDate,
    url: requestUrl
  };

  console.log(formData);

  let request = new XMLHttpRequest();

  request.open('POST', PROXY + SERVER_URL);
  request.setRequestHeader('Content-type', 'application/json; charset=utf-8');

  request.onload = () => {
    console.log(`Received JSON: `, JSON.parse(request.response));

    // if (!request.response)
    //   displayTickets(request.response.current_depart_date_prices, request.response.best_prices);
    // else 
    //   displayError();
  }

  request.send( JSON.stringify(formData) );
}


function displayTickets(departDateTickets, bestPriceTickets) {
  // <h2>Дешёвые билеты на выбранную дату</h2>
  // <ul id="selected-date">
  //   <li class="ticket">
  //     <header>
  //       <h3>Русский полёт</h3>
  //     </header>

  //     <div id="buy">
  //       <a class="action">Купить за 2700₽</a>
  //     </div>

  //     <div id="info">
  //       <div class="block-left">
  //         <p id="city-from">Вылет из города: </p>
  //         <p id="date">2020-03-29</p>
  //       </div>

  //       <div class="block-right">
  //         <p id="transfers">Без пересадок</p>
  //         <p id="city-to">Город назначения: </p>
  //       </div>
  //     </div>
  //   </li>
  // </ul>

  const tickets = document.querySelector('div.tickets');
  const selectedDateList = tickets.querySelector('#selected-date');
  const otherDateList = tickets.querySelector('#other-date');

  if (departDateTickets) {
    departDateTickets.forEach(ticket => {

    });
  } else {

  }
}


function displayError() {

}