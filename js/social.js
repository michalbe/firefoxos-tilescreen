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
  var bigTile = document.getElementById('big-active-tile');
  
  friends.forEach(function(friend, index) {
    var tile = createTile(
      'style/img/fb/' + friend + '.jpg',
      friend,
      { name: friend }
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
    input.placeholder = 'Write to ' + container.dataset.name.toUpperCase();
    
    document.body.classList.add('active');
    bigTile.style.backgroundImage = container.style.backgroundImage;
	});
	
	window.addEventListener('hashchange', function(e) {
	  if (window.location.hash = '#root') {
	    // Home button pressed
	    var active = document.querySelector('.active-tile');
      if(active)
        active.classList.remove('active-tile');
      document.body.classList.remove('active');
	  }
	})
})();