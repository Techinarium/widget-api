Dash.widget('v0', (widget) => {

  const { textbox } = widget.element

  widget.layout({
    name: 'main',
    size: '2x2',
    default: true,
    render: () => {
      const noteContent = widget.data.get('noteContent') || ''

      return textbox({
        styles: {
          width: '100%',
          height: '100%',
          padding: '1em',
          backgroundColor: '#F7E380',
        },
        onInput: function() {
          widget.data.set('noteContent', this.value)
        },
      }, noteContent)
    }
  })
  
})