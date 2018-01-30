var Dash = (function () {
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _data (state) {

  function _save() {
    localStorage.setItem('widget_' + state.id + '_data', JSON.stringify(state.data));
  }

  function _load() {
    state.data = JSON.parse(localStorage.getItem('widget_' + state.id + '_data') || '{}');
  }

  // Try to fetch widget data on initialization.
  _load();

  function get(property) {
    if (Array.isArray(property)) {
      // Take an array, return an array.
      return property.map(function (p) {
        return state.data[p];
      });
    } else if (typeof property === 'string') {
      // Take a string, return a value.
      return state.data[property];
    }
  }

  function set(property, value) {
    // Takes a name and a value, or an object of names and values to update.

    if ((typeof property === 'undefined' ? 'undefined' : _typeof(property)) === 'object') {
      if (typeof value !== 'undefined') {
        throw new Error('data.set() takes either a string and a value, or an object. Received an object as the first parameter and a ' + (typeof value === 'undefined' ? 'undefined' : _typeof(value)) + ' as the second.');
      }
      var props = property;

      // Update by object.
      for (var key in props) {
        state.data[key] = props[key];
      }
    } else if (typeof property === 'string') {
      // Update by value.
      state.data[property] = value;
    } else {
      throw new Error('data.set() takes either a string or an object as the first parameter. Received ' + (typeof parameter === 'undefined' ? 'undefined' : _typeof(parameter)));
    }

    _save(); // Save after every set.
  }

  return { get: get, set: set };
}

function _element (state) {
  function textbox() {
    console.log('Instantiating a textbox element');
  }

  function text() {
    console.log('Instantiating a text element');
  }

  return {
    text: text,
    textbox: textbox
  };
}

function _layout () {
  function layout(conf) {
    console.log('Creating layout with', conf);

    console.log('Rendering view', conf.render());
  }

  function setLayout(name, transition) {
    console.log('Setting layout to ' + name);
  }

  return { layout: layout, setLayout: setLayout };
}

function v0 (id) {
  // Mutable state object shared by the API functions
  var state = {
    id: id,
    dom: null,
    data: {}

    // Rollup doesn't like the word 'data' alone as a function name,
    // so these all have an underscore prepended.
  };var data = _data(state);
  var element = _element(state);

  var _layout2 = _layout(state),
      layout = _layout2.layout,
      setLayout = _layout2.setLayout;

  return {
    get dom() {
      return state.dom;
    },
    data: data,
    element: element,
    layout: layout,
    setLayout: setLayout
  };
}

var main = (function () {
  var APIs = {
    'v0': v0
  };

  function widget(apiVersion, setupFunction) {
    var version = void 0;

    // Make sure apiVersion is a string and the version exists.

    if (typeof apiVersion !== 'string' || apiVersion.toLowerCase()[0] !== 'v') {
      throw new Error('First parameter should be the Widget API version in the vX format: v0, v1, v2, etc.');
    }

    version = apiVersion.toLowerCase();

    if (!APIs[version]) {
      throw new Error('API version ' + apiVersion + ' does not exist. Available: ' + Object.keys(APIs).join(', '));
    }

    // Make sure the setupFunction is a function.

    if (typeof setupFunction !== 'function') {
      throw new Error('Second parameter should be a function that sets up the widget: function(widget) { ... }');
    }

    var API = APIs[version];

    // The API is called as a function to create a brand new copy for each widget.
    // Each widget will have an ID from the database - for now using 123
    setupFunction.call(null, new API('123'));
  }

  return { widget: widget };
})();

return main;

}());
