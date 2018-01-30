# Dash Widget API v0

Widgets require three main things in order to work:
  - A call to `Widget.define()` with two params: the API version string, and your setup function.
  - At least one layout defined with `widget.layout()`

# Goal

> Sticky Note widget

```js
Dash.widget('v0', (widget) => {

  widget.config({ apiVersion: 'v1' });

  widget.layout({
    name: 'main',
    size: '2x2',
    default: true,
    render: () => {
      const noteContent = widget.data.get('noteContent') || '';

      return widget.element.textbox({
        styles: {
          width: '100%',
          height: '100%',
          backgroundColor: '#F7E380',
        },
        onInput: (e) => {
          widget.data.set('noteContent', this.value);
        },
      }, noteContent);
    }
  });

});
```

# Basic API

### `Dash.widget(apiVersion, setupFunction)`

Takes an API version and a setup function that gets passed a reference to the API version you specified.

```js
Dash.widget('v1', widget => {
  // Do stuff.
});

// or non-arrow style - both are the same
Dash.widget('v1', function(widget) {
  // Do stuff.
});
```

### `widget.element`
  An object that holds all of the functions for producing different layout elements.

```js
Available elements:

.text(props, text) or .text(text)
  // Returns a basic text element.

.textbox(props, text) or .textbox(text)
  // Like a textarea - lets the user type in text.

.image(props, src) or .image(src)
  // Returns an image element. `src` behaves the same as HTML `src`,
  // so it can point to a remote image or take a Base64 encoded image string.

.vbox(props, children[]) or .vbox(children[])
  // Returns a container that stacks its children vertically.
  // Like `flex-flow: column nowrap` in CSS.

.hbox(props, children[]) or .hbox(children[])
  // Returns a container that aligns its children horizontally.
  // Like `flex flow: row nowrap` in CSS.
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

### `widget.setLayout(name[, transition])`
  Changes the widget's layout and re-renders. Takes an optional transition function - transition can be a function or the name of one included by default or created with `widget.layout.transition()`.

```js
// We can use the transition we defined above.
widget.setLayout('layout2', 'slideUp');
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
