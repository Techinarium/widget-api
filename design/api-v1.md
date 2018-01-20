# Dash Widget API v1 (Proposal)

Widgets require three main things in order to work:
  - A `main` function that sets up the widget
  - A `widget.config()` call that sets at least the `apiVersion` (currently `v1`)
  - At least one layout defined with `widget.layout()`

# Examples

## Hello World

```js
function main(widget) {
  widget.config({ apiVersion: 'v1' });

  widget.layout({
    name: 'main',
    size: '2x1',
    default: true,
    render: () => {
      return widget.element.text('Hello, world!');
    }
  });
}
```

## Sticky Note

```js
function main(widget) {
  widget.config({ apiVersion: 'v1' });

  const { textbox } = widget.element;

  widget.layout({
    name: 'main',
    size: '2x2',
    default: true,
    render: () => {
      // Widget data is persistent, so no need for onLoad or onUnload here
      const noteContent = widget.data.get('noteContent');

      return textbox({
        styles: {
          width: '100%',
          height: '100%',
          backgroundColor: '#F7E380'
        },
        onInput: (e) => {
          // In event handlers, 'this' refers to the DOM element
          // note content gets saved as it's typed
          widget.data.set('noteContent', this.value);
        }
      }, noteContent || '');
    }
  });
}
```

## Weather

```js
function main(widget) {
  widget.config({
    apiVersion: 'v1',
    userOptions: [
      {
        name: 'zipCode',
        label: 'ZIP Code',
        type: 'text',
        default: '90210',
      },
      {
        name: 'refreshInterval',
        label: 'Refresh Interval',
        type: 'select',
        options: [
          { label: '1 minute',   value: 60      },
          { label: '5 minutes',  value: 60 * 5  },
          { label: '15 minutes', value: 60 * 15 },
          { label: '1 hour',     value: 60 * 60 },
        ],
        default: 1, // Index of options array
      },
    ]
  });

  const { image, text, vbox, hbox } = widget.element;

  // Layouts

  widget.layout({
    name: 'standard',
    size: '1x1',
    default: true, // Sets this layout automatically when widget loads at this size
    render: () => {
      const [icon, f, c] = widget.data.get(['weatherIcon', 'fahrenheit', 'celsius']);

      const textStyle = {
        size: 16,
        weight: 'bold',
      };

      const imageStyle = {
        margin: {
          bottom: 10
        },
        height: 75
      };

      return vbox({ styles: { anchor: { x: '50%', y: '50%' } } }, [
        image({ styles: imageStyle }, icon),
        text({ styles: textStyle }, `${f}° F`),
        text({ styles: textStyle }, `${c}° C`),
      ]);
    }
  });

  widget.layout({
    name: 'error',
    size: '1x1',
    render: () => {
      const message = widget.data.get('errorMessage');

      const textStyle = {
        size: 16,
        weight: 'bold',
        color: 'red',
      };

      return vbox({ styles: { anchor: { x: '50%', y: '50%' } } }, [
        text({ styles: textStyle }, message || 'Something happened')
      ]);
    }
  });

  // Logic

  const { onLoad, onRefresh, onUnload, autoRefresh } = widget.lifecycle;

  autoRefresh(widget.userOptions('refreshInterval')); // Automatically refresh at user's chosen interval

  onLoad(() => {
    // Widget setup
  });

  onRefresh(() => {
    // Runs whenever the user manually refreshes the widget,
    // or when the widget refresh timer runs out

    // This function will run, then the display will be updated.
    // Anything that's going to change what's displayed should go here.

    const zip = widget.userOptions('zipCode');

    return widget.http.get(`http://samples.openweathermap.org/data/2.5/weather?zip=${zip},us&appid=b6907d289e10d714a6e88b30761fae22`)
      .then(weather => {
        return new Promise(resolve => {
          const { temp } = weather.main; // in Kelvin
          const { icon } = weather.weather[0];

          const c = temp - 273.15;
          const f = c * 1.8 + 32;

          widget.data.set({
            weatherIcon: `http://openweathermap.org/img/w/${icon}.png`,
            celsius: c,
            fahrenheit: f
          });

          return resolve();
        });
      })
      .catch(err => {
        widget.data.set('errorMessage', err.message);
        widget.layout.set('error');
      });
  });

  onUnload(() => {
    // Widget teardown
    // This is a good time to save things or sync
  });
}
```

# Widget API

### `widget.config(configObj)`

  A function that takes a configuration object. Used to define how your widget works and what options the user can change.

```js
widget.config({
  apiVersion: 'v1', // required
  userOptions: [ // optional
    {
      name: 'coolOption', // How you'll refer to the value in your code
      label: 'A Cool Option', // The name the user sees
      type: 'checkbox', // What kind of control? (also text and select)
      default: true, // Default value unless changed by the user
    },
    {
      name: 'otherOption',
      label: 'Which Thing?',
      type: 'select',
      options: [
        { label: 'Thing One', value: 5 },
        { label: 'Thing Two', value: 71 },
      ],
      default: 0, // In this case, default is the array index of the default option
    }
  ]
});
```

### `widget.element`
  An object that holds all of the functions for producing different layout elements.

```js
Available elements:

.text(props, text) or .text(text)
  // Returns a basic text element.

.image(props, src) or .image(src)
  // Returns an image element. `src` behaves the same as HTML `src`,
  // so it can point to a remote image or take a Base64 encoded image string.

.vbox(props, children[]) or .vbox(children[])
  // Returns a container that stacks its children vertically.
  // Like `flex-flow: column nowrap` in CSS.

.hbox(props, children[]) or .hbox(children[])
  // Returns a container that aligns its children horizontally.
  // Like `flex flow: row nowrap` in CSS.

.link(props, children[])
  // Like an 'a' tag. Children can be an array of elements, or just a string.
  // The 'props' object should contain a 'to' property:
  //   .link({ to: 'https://google.com' }, 'Google')
  // When clicked, it'll open the 'to' location in another tab.

.button(props, text)
  // A button. 'props' should hold an onTouch/onClick function so it actually does something.

.canvas(props)
  // A canvas for drawing shapes and text with a function.
  // 'props' should contain a 'draw' function.
  //    .canvas({
  //      styles: {
  //        width: '100%',
  //        height: '100%',
  //      },
  //      draw: (canvas) => {
  //        canvas.square({
  //          width: 100,
  //          x: '50%',
  //          y: '50%',
  //        }).fill('red');
  //      }
  //    });
  // The draw function takes a reference to the Canvas API object.
```

### `widget.animation`
  Contains utilities for easily animating widget layout elements.

```js
Properties:

.tween(element, config)
  // Defines a tween (animation from one 'styles' state to another)

.curves
  // Contains several animation curves. Pass them into tween config.curve
  .linear
  .easeIn
  .easeOut
  .easeInOut
  .elastic
```

### `widget.http`
  Contains methods for sending and receiving data. All methods return a Promise.

```js
const { http } = widget;

http.get('http://www.example.com/data.json')
  .then(data => {
    // Do something with it.
  })
  .catch(err => console.log('HANDLE ERROR'))

http.post('http://www.example.com/api/cats/submit', {
    name: 'Garfield',
    color: 'orange',
    weight: 'fat'
  })
  .then(response => {
    if (response.code === 200) {
      // It worked
    } else {
      // Who knows?
    }
  })
  .catch(err => {
    // It didn't work
  });
```

### `widget.layout(config)`
  Creates a widget layout for a specified widget size or set of sizes.

```js
config object has four properties:

{
  name: 'main', // How you'll refer to it in widget.setLayout()
  size: '2x2', // Which size this layout supports - can also be an array: ['1x1', '2x2']
  default: true, // Automatically set this layout on load when widget is at a compatible size.
  render: () => {...}, // Defines the elements to be created for this layout.
}
```

### `widget.layout.transition(name, func)`
  Registers a transition function that can be used when changing layouts. Several of these are provided already, but this API allows you to define your own.

```js
// Defines a function that takes the old and new layout root elements
// and returns a Promise. When the Promise resolves, the oldRoot is removed from the DOM.

widget.layout.transition('slideUp', (oldRoot, newRoot) => {
  const { tween, curves } = widget.animation;

  // The 'tween' function here returns a promise already,
  // so we can just return the call to 'tween'
  return tween(newRoot, {
    from: {
      top: '100%'
    },
    to: {
      top: '0%'
    },
    length: 0.5,
    curve: curves.cubicBezier
  });
});
```

### `widget.setLayout(name[, transition])`
  Changes the widget's layout and re-renders. Takes an optional transition function - transition can be a function or the name of one included by default or created with `widget.layout.transition()`.

```js
// We can use the transition we defined above.
widget.setLayout('layout2', 'slideUp');
```

### `widget.userOptions(name)`
  Returns the current value of the userOption with a matching name

### `widget.assets`
  Used for pulling pre-stored assets into your widget layouts. These assets are uploaded by the widget author when the widget is created. If external files are required, the `widget.http` API should be used to fetch them.

```js
widget.assets.get(assetName)
  // Returns a usable layout element depending on the type of file (image, etc)

// No widget.assets.set (yet) - widgets probably shouldn't be able to change their assets at runtime
```

### `widget.data`
  A key-value store that saves persistent data per-instance of a widget. Useful for keeping track of variables and caching things.

```js
.get(name) or .get([...names])
  // Retrieve one or more values by their keys.
  // Passing a single value will return one value,
  // and an array will return an array.

.set(name, value) or .set({ name: value })
  // Store one or more values. Passing an object allows for
  // storing several values with one function call.
```

### `widget.dom`
  Holds a reference to the widget container's DOM element, because sometimes the APIs just aren't enough.
