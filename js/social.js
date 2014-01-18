(function(){
  // Mocked friends
  var friends = [
    'vicky',
    'andrew',
    'mike',
    'dominica',
    'jan',
    'mac',
    'mack',
    'sandy',
    'jacob',
    'patricia',
    'donut',
    'jimmy',
    'agnes',
    'isabella',
    'julia',
    'maria',
    'franco',
    'meggie',
    'maya',
    'natalia',
    'paula',
    'sandra'
  ];
  
  // Randomize friends
  friends.sort(function() {
    return .5 - Math.random();
  });
  
  var parent = document.getElementById('social');
  
  friends.forEach(function(friend, index) {
    var tile = createTile(
      'style/img/fb/' + friend + '.jpg',
      friend,
      index === 1 ? { notification: 1 } : {}
    );
    
    parent.appendChild(tile);
  });
  
  parent.addEventListener('click', function(e) {
    var active = document.querySelector('.active-tile');
    if(active)
      active.classList.remove('active-tile');
    
		var container = e.target
    container.classList.add('active-tile');
	});
})();