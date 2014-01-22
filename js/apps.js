(function() {

	// Hidden manifest roles that we do not show
	var HIDDEN_ROLES = ['system', 'keyboard', 'homescreen'];

	// Apps container
	var parent = document.getElementById('apps');
  var socialParent = document.getElementById('social');
  
	// List of all application icons
	var icons = [];

	/**
	 * Represents a single app icon on the homepage.
	 */
	function Icon(app, entryPoint) {
		this.app = app;
		this.entryPoint = entryPoint;
	}

	Icon.prototype = {

		get name() {
			return this.descriptor.name;
		},

		get icon() {
			if (!this.descriptor.icons) {
				return '';
			}
			return this.descriptor.icons['120'];
		},

		get descriptor() {
			if (this.entryPoint) {
				return this.app.manifest.entry_points[this.entryPoint];
			}
			return this.app.manifest;
		},

		/**
		 * Renders the icon to the container.
		 */
		render: function() {
			if (!this.icon) {
				return;
			}

      // App Icon
			var tile = document.createElement('div');
			tile.className = 'tile';
			
			var dataset = {
			  origin: this.app.origin
			}
			
			if (this.entryPoint) {
				dataset.entryPoint = this.entryPoint;
			}
			
			var iconPath = this.app.origin + this.icon;
			
			// Temporary icons
			if (this.descriptor.name === 'Browser') {
		    iconPath = 'style/icons/Browser.jpg';
		  } else {
		    //tile.style.backgroundSize = "180%";
		  }
      
      var tile = createTile(iconPath, this.descriptor.name, dataset);
			parent.appendChild(tile);
		},

		/**
		 * Launches the application for this icon.
		 */
		launch: function() {
			if (this.entryPoint) {
				this.app.launch(this.entryPoint);
			} else {
				this.app.launch();
			}
		}
	};

	/**
	 * Creates icons for an app based on hidden roles and entry points.
	 */
	function makeIcons(app) {
		if (HIDDEN_ROLES.indexOf(app.manifest.role) !== -1) {
			return;
		}

		if (app.manifest.entry_points) {
			for (var i in app.manifest.entry_points) {
				icons.push(new Icon(app, i));
			}
		} else {
			icons.push(new Icon(app));
		}
	}

	/**
	 * Returns an icon for an element.
	 * The element should have an entry point and origin in it's dataset.
	 */
	function getIconByElement(element) {
		var elEntryPoint = element.dataset.entryPoint;
		var elOrigin = element.dataset.origin;

		for (var i = 0, iLen = icons.length; i < iLen; i++) {
			var icon = icons[i];
			if (icon.entryPoint === elEntryPoint && icon.app.origin === elOrigin) {
				return icon;
			}
		}
	}

  /**
   * Pinch & zoom design change
   */
  
  var gd = new GestureDetector(parent);
  gd.startDetecting();

  parent.addEventListener('transform', function(e) {
    var scale = e.detail.relative.scale;
    if (scale < 1) {
      parent.classList.add('small-icons');
    } else if (scale > 1) {
      parent.classList.remove('small-icons');
    }
  });
  
  // Switching from Apps to Social tabs
  var initialTouchPosition = [];
  var deltaX = 0;
  var threshold = 30;
  
  // Actions
  var panStart = function(evt) {
    // evt.stopPropagation();
    //     evt.target.setCapture(true);
    window.addEventListener('touchmove', moveEventInit);
    window.addEventListener('touchend', moveEnd);
    window.addEventListener('swipe', moveEnd);

    if (evt.touches) {
      initialTouchPosition = [evt.touches[0].pageX, evt.touches[0].pageY];
    } else {
      initialTouchPosition = [evt.pageX, evt.pageY];
    }
  };
  
  var moveEventInit = function(evt) {
    evt.stopPropagation();
    var touchPosition = evt.touches ? [evt.touches[0].pageX,
                                       evt.touches[0].pageY] :
                                      [evt.pageX, evt.pageY];

    deltaX = initialTouchPosition[0] - touchPosition[0];
    
    if (Math.abs(deltaX) > threshold) {
      socialParent.style.display = 'block';
      window.removeEventListener('touchmove', moveEventInit);
      window.addEventListener('touchmove', moveEventAction);
    }
  }
  
  var moveEventAction = function(evt) {
    deltaX = initialTouchPosition[0] - (evt.touches ? evt.touches[0].pageX :
                                            evt.pageX);
    move();
  }
  
  var move = function(){
    var translateSign = 100;
    if (deltaX < 0) {
      return;
    }
    
    var movementFactor = Math.abs(deltaX) / window.innerWidth;
    socialParent.style.transform = 'translateX(' + (translateSign * (1 - movementFactor)) + '%)';
                    
  }
  
  var moveEnd = function(evt) {
    evt.stopPropagation();
    var element = evt.target;
    var eventDetail = evt.detail;

    document.releaseCapture();
    window.removeEventListener('touchmove', moveEventInit);
    window.removeEventListener('touchmove', moveEventAction);
    window.removeEventListener('touchend', moveEnd);
    window.removeEventListener('swipe', moveEnd);

    var eventDetailEnd = eventDetail.end;
    var dx;
    
    if (eventDetailEnd) {
      dx = eventDetail.dx;
      direction = eventDetail.direction;
    } else { 
      
      if (evt.touches[0]) {
        dx = evt.touches[0].pageX - initialTouchPosition[0];
      } else {
        dx = evt.pageX - initialTouchPosition[0];
      }
      
      direction = dx > 0 ? 'right' : 'left';
    }
    
    if (Math.abs(dx) > window.innerWidth/2) {
      socialParent.style.transform = 'translateX(0)';
      socialParent.style.position = 'static';
      parent.style.display = 'none';
      window.removeEventListener('touchstart', panStart);
    } else {
      socialParent.style.transform = 'translateX(100%)';
      socialParent.style.display = 'none';
    }
  }
  
  // Adding listeners
  window.addEventListener('touchstart', panStart);
  
	/**
	 * Fetch all apps and render them.
	 */
	navigator.mozApps.mgmt.getAll().onsuccess = function(event) {
		event.target.result.forEach(makeIcons);
		icons.forEach(function(icon) {
			icon.render();
		});
	};

	/**
	 * Add an event listener to launch the app on click.
	 */
	parent.addEventListener('click', function(e) {
		var container = e.target
		var icon = getIconByElement(container);
		icon.launch();
	});

}());
