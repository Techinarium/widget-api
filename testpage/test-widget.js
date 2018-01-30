console.log(Dash);

const DashHook = (function() {
  function widget(api, setup) {
    Dash.widget(api, setup);

    // Connect to DOM element
  }

  return { widget }
})();

DashHook.widget('v0', (widget) => {

  console.log(widget)

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
