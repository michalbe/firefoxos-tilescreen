(function(){
  console.log('screen width', window.innerWidth, 'height', window.innerHeight);
  var socialParent = document.getElementById('social');
  var appsParent = document.getElementById('apps');
  var socialActive = false;

  // Switching from Apps to Social tabs
  var initialTouchPosition = [];
  var deltaX = 0;
  var threshold = 150;
  
  // Actions
  var panStart = function(evt) {
    evt.stopPropagation();
    evt.target.setCapture(true);
    
    if (evt.touches) {
      initialTouchPosition = [evt.touches[0].pageX, evt.touches[0].pageY];
    } else {
      initialTouchPosition = [evt.pageX, evt.pageY];
    }
    window.addEventListener('touchmove', moveEventInit);
  };
  
  var moveEventInit = function(evt) {
    evt.stopPropagation();
    var touchPosition = evt.touches ? [evt.touches[0].pageX,
                                       evt.touches[0].pageY] :
                                      [evt.pageX, evt.pageY];

    deltaX = initialTouchPosition[0] - touchPosition[0];
    
    if (Math.abs(deltaX) > threshold) {
      window.addEventListener('touchend', moveEnd);

      socialParent.style.position = 'absolute';
      if (!socialActive && deltaX > 0) {
        socialParent.style.display = 'block';
      } else if (socialActive && deltaX < 0){
        appsParent.style.display = 'block';
      }
      
      window.removeEventListener('touchmove', moveEventInit);
      window.addEventListener('touchmove', moveEventAction);
    }
  }
  
  var moveEventAction = function(evt) {
    deltaX = initialTouchPosition[0] - (evt.touches ? evt.touches[0].pageX :
                                            evt.pageX);
    move();
  }
  
  var move = function() {
    console.log('--', deltaX);
    var translateSign = 100;
    var movementFactor; 
    if (!socialActive && deltaX > 0) {
      movementFactor = translateSign * (1 - (Math.abs(deltaX) / window.innerWidth));
      socialParent.style.transform = 'translateX(' + movementFactor + '%)';
    } else if (socialActive && deltaX < 0) {
      movementFactor = 100 - (translateSign * (1 - (Math.abs(deltaX) / window.innerWidth)));
      socialParent.style.transform = 'translateX(' + movementFactor + '%)';
    } 
  }
  
  var moveEnd = function(evt) {
    evt.stopPropagation();
    var element = evt.target;
    var eventDetail = evt.detail;

    document.releaseCapture();
    window.removeEventListener('touchmove', moveEventInit);
    window.removeEventListener('touchmove', moveEventAction);
    window.removeEventListener('touchend', moveEnd);

    if (Math.abs(deltaX) > window.innerWidth/2) {
      if (!socialActive && deltaX > 0) {
        socialParent.style.transform = 'translateX(0)';
        socialParent.style.position = 'static';
        appsParent.style.display = 'none';
        socialActive = true;
      } else if (socialActive && deltaX < 0){
        socialParent.style.transform = 'translateX(100%)';
        socialParent.style.display = 'none';
        socialActive = false;
      }
    } else {
      socialParent.style.transform = 'translateX(100%)';
      socialParent.style.display = 'none';
    }
  }
  
  // Adding listeners
  window.addEventListener('touchstart', panStart);
})();
