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
  
  friends.forEach(function(friend){
    var tile = createTile(
      'style/img/fb/' + friend + '.jpg',
      friend,
      {}
    );
    
    parent.appendChild(tile);
  });
})();