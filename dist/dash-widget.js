var Dash = (function () {
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _data (state) {

  if (!state.data) state.data = {};

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
    } else {
      throw new Error('data.get() takes either an array or a string as the first parameter. Received ' + (typeof parameter === 'undefined' ? 'undefined' : _typeof(parameter)));
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
  function _applyStyles(el, styles) {
    for (var prop in styles) {
      var name = prop.replace(/([a-z\d])([A-Z])/, '$1-$2').toLowerCase();

      console.log('style: ', name, styles[prop]);

      el.style[name] = styles[prop];
    }
  }

  function _attachHandler(el, name, handler) {
    // Handle properties starting with 'on'

    var eventName = name.slice(2).toLowerCase();

    console.log(eventName);

    el.addEventListener(eventName, handler);
  }

  function _applyAttribute(el, name, value) {
    switch (name.toLowerCase()) {
      default:
        el.setAttribute(name, value);
        break;
    }
  }

  function _applyProps(el, props) {
    for (var key in props) {
      var k = key.toLowerCase();

      if (/^on/.test(k)) {
        // Is an event handler
        _attachHandler(el, key, props[key]);
      } else if (k === 'styles') {
        _applyStyles(el, props[key]);
      } else {
        // Treat as a regular attribute.
        _applyAttribute(el, key, props[key]);
      }
    }
  }

  function _el(tag, props) {
    // Create DOM nodes.
    var el = document.createElement(tag);
    if (props) {
      _applyProps(el, props);
    }
    return el;
  }

  function textbox(props, children) {
    console.log('Instantiating a textbox element');
    var el = _el('textarea');

    _applyStyles(el, {
      position: 'relative',
      border: 0,
      resize: 'none'
    });

    _applyProps(el, props);

    if (typeof children === 'string') {
      el.value = children;
    }

    return el;
  }

  function text() {
    console.log('Instantiating a text element');
  }

  return {
    text: text,
    textbox: textbox
  };
}

var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _layout (state) {

  if (!state.layouts) state.layouts = [];

  function layout(conf) {
    // Validate
    if ((typeof conf === 'undefined' ? 'undefined' : _typeof$1(conf)) === 'object' && !Array.isArray(conf)) {
      // It's the right type of thing. Make sure it has the right properties.

      if (typeof conf.name !== 'string') {
        // name must exist and be a string
      }

      if (typeof conf.size !== 'string' && !Array.isArray(conf.size)) {
        // size must be a string or array
      }

      if (typeof conf.render !== 'function') {
        // must have a render function
      }

      state.layouts.push(conf); // Everything checks out
    } else {
      if (!conf) {
        throw new Error('api.layout() was called without any layout object.');
      } else {
        throw new Error('api.layout() takes a layout object as the first parameter. Received ' + (typeof conf === 'undefined' ? 'undefined' : _typeof$1(conf)));
      }
    }
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
    private: {
      // This is where the internal lifecycle triggers and things might go
      // Stuff that's used by Dash behind the scenes
      get state() {
        return state;
      }
    },
    public: {
      get dom() {
        return state.dom;
      },
      data: data,
      element: element,
      layout: layout,
      setLayout: setLayout
    }
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

    // The API is called as a function to create a brand new copy for each widget.
    // Each widget will have an ID from the database - for now using 123
    var api = new APIs[version]('123');

    // TODO: Make the private portion available to the behind-the-scenes dashboard code

    // Send off the public portion to the caller.
    setupFunction.call(null, api.public);

    // HACK: Do this better
    var el = api.private.state.layouts[0].render();
    return el;
  }

  return { widget: widget };
})();

return main;

}());
