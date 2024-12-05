const characterDropdownMain = document.getElementById('characterDropdownMain');
const characterDropdownFav = document.getElementById('characterDropdownFavorites');
const charCard = document.getElementById('charCard');
let charList = [];
const dropdownTitles = document.getElementById('dropdownTitles');
const searchInput = document.getElementById('searchInput');
const searchResultsDiv = document.getElementById('searchResultsDiv');
const searchResultsList = document.getElementById('searchResultsList');

document.addEventListener('DOMContentLoaded', function() {
  let fetchPromises = [];

  for (let i = 0; i <= 42; i++) {
    // Push the fetch promises to an array
    fetchPromises.push(
      fetch(`https://rickandmortyapi.com/api/character/?page=${i}`)
        .then(response => response.json())
        .then(data => {
          charList = charList.concat(data.results); // Concatenate results correctly
        })
    );
  }

  // Use Promise.all to wait for all fetch requests to complete
  Promise.all(fetchPromises).then(() => {
    let mainList = charList.slice(0, 5);
    mainList.forEach((e) => {
      characterDropdownMain.innerHTML += `<li><a class="dropdown-item" onclick='populate("${e.name}")'>${e.name}</a></li>`;
    });
    populate(mainList[0].name);
    removeDuplicates();
    createDropDownFav();
    createDropDownAlpha();
  });

  

});



function search() {
  let searchText = searchInput.value.toLowerCase();
  searchResultsList.innerHTML = ''; // Clear previous results

  if (searchText.length > 0) {
    // Filter charList for names that include the search text
    // Note: charList should be available and contain the list of characters
    let filteredResults = charList.filter(character =>
      character.name.toLowerCase().includes(searchText)
    ).slice(0, 5);

    // Create list items for each result safely
    filteredResults.forEach(char => {
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      link.className = 'dropdown-item';
      link.textContent = char.name; // Set text safely
      link.addEventListener('click', () => populate(char.name)); // Attach event handler
      listItem.appendChild(link);
      searchResultsList.appendChild(listItem);
    });

    searchResultsDiv.style.display = 'block';
    searchResultsDiv.style.width = `${searchInput.offsetWidth}px`;
  } else {
    searchResultsDiv.style.display = 'none'; // Hide the list if input is empty
  }
}


function populate(charName) {
  searchResultsDiv.style.display = 'none';
  searchInput.value = '';

  const i = charList.findIndex(char => char.name === charName);
  let character = charList[i];

  // Set the favorite property to true if it doesn't exist
  if (character.favorite === undefined) {
    character.favorite = false;
  }
  
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  if (favorites.includes("" + i)) {
    character.favorite = true;
  }
  
  charCard.innerHTML = `
    <img src='${character.image}' alt='Character Image' class="card-img-top character-image">
    <button onclick="favorite('${i}')" class="favorite-btn"><i class="${character.favorite ? `fa-solid` : `fa-regular`} fa-heart" id="favHeart"></i></button>
   
    <div class="card-body">
      <h5 class="card-title">${character.name}</h5>
      <p class="card-text">Status: ${character.status}</p>
      <p class="card-text">Species: ${character.species}</p>
      ${character.type ? `<p class="card-text">Type: ${character.type}</p>` : ''}
      <p class="card-text">Gender: ${character.gender}</p>
      <p class="card-text">Origin: ${character.origin.name}</p>
      <p class="card-text">Location: ${character.location.name}</p>
      <p class="card-text">Episodes: ${character.episode.length}</p>
    </div>`;
}

function createDropDownFav() {
  const currFavs = JSON.parse(localStorage.getItem('favorites')) || [];
  let favList = [];
  currFavs.forEach(e => favList.push(charList[parseInt(e)]));
  characterDropdownFav.innerHTML = "";
  favList.forEach(e => {
    characterDropdownFav.innerHTML += `<li><a class="dropdown-item" onclick='populate("${e.name}")'>${e.name}</a></li>`;
  });
}

function createDropDownAlpha() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  alphabet.forEach(letter => {
    // Filter the charList for characters that start with the current letter
    const filteredChars = charList.filter(char => char.name.startsWith(letter));

    // Map over filteredChars to create list item strings
    const listItems = filteredChars.map(char => `<li><a class="dropdown-item" onclick='populate("${char.name}")'>${char.name}</a></li>`).join('');

    // Append the dropdown and its items to the dropdownTitles innerHTML
    dropdownTitles.innerHTML += `
      <li class="nav-item dropdown">
        <a class="nav-link" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          ${letter}
        </a>
        <ul class="dropdown-menu" id="dropdownMenu${letter}">
          ${listItems}
        </ul>
      </li>`;
  });
}

function removeDuplicates() {
  // Assuming charList is an array of objects and each object has a 'name' property.
  let seen = {};
  console.log(charList.length);
  // Filter the charList to remove objects with a 'name' that has already been encountered.
  let filteredCharList = charList.filter((character) => {
    return seen.hasOwnProperty(character.name) ? false : (seen[character.name] = true);
  });

  // Now filteredCharList contains only the first occurrence of each name.
  charList = [...filteredCharList];
}

function favorite(i) {
  charList[i].favorite = !charList[i].favorite;
  let currFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const index = currFavorites.indexOf(i);

  if (index === -1) {
    // Element not in array, so add it
      currFavorites.push(i);
  } else {
    // Element in array, so remove it
      currFavorites.splice(index, 1);
  }
  localStorage.setItem('favorites', JSON.stringify(currFavorites));
  populate(charList[i].name);
  createDropDownFav();
}

searchInput.addEventListener('input', search);