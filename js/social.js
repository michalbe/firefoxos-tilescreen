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
  var bigTileLabel = bigTile.getElementsByClassName('app-label')[0];
  
  friends.forEach(function(friend, index) {
    var dataset = { name: friend };
    if (index === 1) dataset.notifications = 1;

    var tile = createTile(
      'style/img/fb/' + friend + '.jpg',
      friend,
      dataset
    );
    
    parent.appendChild(tile);
  });
  
  parent.addEventListener('click', function(e) {
    if (!e.target.classList.contains('tile')) {
      return;
    }
    
    var container = e.target
    var name = container.dataset.name;
    input.value = '';
    
    if (container.dataset.notifications) {
      input.placeholder = 'Reply to ' + name.toUpperCase();
      delete container.dataset.notifications;
      container.removeChild(container.childNodes[0]);
    } else {
      input.placeholder = 'Write to ' + name.toUpperCase();
    }
    
    document.body.classList.add('active');
    bigTile.style.backgroundImage = container.style.backgroundImage;
    bigTileLabel.innerHTML = name;
  });
  
  window.addEventListener('hashchange', function(e) {
    if (window.location.hash.indexOf('#root') > -1) {
      document.body.classList.remove('active');
    }
  });

  input.addEventListener('keypress', function(e){
    if (e.keyCode === 13) {
      talkModule.say(input.value);
      input.value = '';
    }
  });
  
  var talkModule = (function() {
    var clear = function() {
      bigTile.innerHTML = '';
      bigTile.appendChild(bigTileLabel);
    };
    
    var createMsg = function(content, incoming) {
      var msg = document.createElement('div');
      msg.classList.add('msg');
      if (incoming) {
        msg.classList.add('incoming');
      } else {
        msg.classList.add('outgoing');
      }
      
      var id = Math.random().toString(36).slice(2).toUpperCase();
      msg.id = id;
      msg.textContent = content;
      
      bigTile.appendChild(msg);

      window.location.hash = "#" + id;
    }

    var say = function(what) {
      createMsg(what, false);
      setTimeout(function(){
        createMsg(what, true);
      }, 2500);
    }
    
    return {
      say: say,
      clear: clear
    }
  })();
})();
