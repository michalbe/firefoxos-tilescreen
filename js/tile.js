var createTile = function(icon, name, dataset) {
  var tile = document.createElement('div');
  tile.className = 'tile';
  
  for (var el in dataset) {
    tile.dataset[el] = dataset[el];
  }
  
  tile.style.backgroundImage = 'url(' + icon + ')';
  
  // App Label
  var label = document.createElement('span');
  label.classList.add('app-label');
  label.innerHTML = name;
  
  tile.appendChild(label);
  
  return tile;
}