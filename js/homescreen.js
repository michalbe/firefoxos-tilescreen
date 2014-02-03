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
      if (!socialActive) {
        socialParent.style.display = 'block';
      } else {
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
    var translateSign = 100;
    var movementFactor = translateSign * (1 - (Math.abs(deltaX) / window.innerWidth));
    if (socialActive) movementFactor = 100 - movementFactor;
    socialParent.style.transform = 'translateX(' + movementFactor + '%)';
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
      if (!socialActive) {
        socialParent.style.transform = 'translateX(0)';
        socialParent.style.position = 'static';
        appsParent.style.display = 'none';
        socialActive = true;
      } else {
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
