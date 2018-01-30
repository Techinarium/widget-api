console.log(Dash);

const DashHook = (function() {
  function widget(api, setup) {
    const start = Date.now();
    const w = Dash.widget(api, setup);
    console.log(`Initialized widget in ${Date.now() - start}ms`)

    console.log(w)

    // Connect to DOM element
    document.getElementById('widget').appendChild(w)
  }

  return { widget }
})();

DashHook.widget('v0', (widget) => {

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
          padding: '1em',
          backgroundColor: '#F7E380',
        },
        onInput: function() {
          widget.data.set('noteContent', this.value);
          console.log(this.value)
        },
      }, noteContent);
    }
  });

});
