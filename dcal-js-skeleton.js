let charList = [];
const resultsDiv = document.getElementById('resultsDiv');

document.addEventListener('DOMContentLoaded', function() {
  fetch('https://rickandmortyapi.com/api/character')
    .then(response => response.json())
    .then(data => {
      charList = data.results;
      resultsDiv.innerHTML = charList[0].name;
    });
});