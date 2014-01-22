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
  var input = document.getElementById('social-input');
  
  friends.forEach(function(friend, index) {
    var tile = createTile(
      'style/img/fb/' + friend + '.jpg',
      friend,
      index === 1 ? { notification: 1 } : {}
    );
    
    parent.appendChild(tile);
  });
  
  parent.addEventListener('click', function(e) {
    if (!e.target.classList.contains('tile')) {
      return;
    }
    var active = document.querySelector('.active-tile');
    if(active)
      active.classList.remove('active-tile');
    
		var container = e.target
    container.classList.add('active-tile');
    input.value = '';
    
    parent.classList.add('active');
	});
	
	window.addEventListener('hashchange', function(e) {
	  if (window.location.hash = '#root') {
	    // Home button pressed
	    var active = document.querySelector('.active-tile');
      if(active)
        active.classList.remove('active-tile');
      parent.classList.remove('active');
	  }
	})
})();