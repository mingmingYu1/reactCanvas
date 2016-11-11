import React from 'react'
import ReactDOM from 'react-dom'
import Simditor from 'simditor'
import './index.less'

export default React.createClass({
  getInitialState() {
    return {
      textValue: ''
    }
  },

  newEditor() {
    var textbox = ReactDOM.findDOMNode(this.refs.textarea);
    return new Simditor({
      textarea: $(textbox),
      placeholder: '',
      defaultImage: 'images/image.png',
      params: {},
      upload: false,
      tabIndent: true,
      toolbar: [
        'title',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        'fontScale',
        'ol' ,         
        'ul' ,             
        'table' ,    
        'indent' ,
        'outdent' ,
        'alignment'
      ],
      toolbarFloat: true,
      toolbarFloatOffset: 0,
      toolbarHidden: false,
      pasteImage: false,
      cleanPaste: false,
    });
  },

  componentDidMount() {
    var self = this
    var editor = this.newEditor()
    editor.on('valuechanged', (e, src) =>{
      self.props.editorCallBack(editor.getValue())
    })
  },

  render() {
    return (
      <div>
        <textarea ref='textarea' />
      </div>
    )
  }
})