(function() {

  // Hidden manifest roles that we do not show
  var HIDDEN_ROLES = ['system', 'keyboard', 'homescreen'];

  // Apps container
  var parent = document.getElementById('apps');
  
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
      
      //var iconPath = this.app.origin + this.icon;
      
      // Temporary icons
      var iconPath = 'style/icons/Icon_' + this.descriptor.name+ '.png';
      
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

  parent.addEventListener('transform', function(evt) {
    evt.stopPropagation();
    evt.target.setCapture(true);
    var scale = evt.detail.relative.scale;
    if (scale < 1) {
      parent.classList.add('small-icons');
    } else if (scale > 1) {
      parent.classList.remove('small-icons');
    }
  });
  
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
    if (container.classList.contains('tile')) {
      var icon = getIconByElement(container);
      icon.launch();
    }
  });

}());
