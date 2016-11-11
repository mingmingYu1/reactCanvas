import React from 'react'
import './index.less'
import Input from 'bfd/Input'
import ReactDOM from 'react-dom'

export default React.createClass({

  getInitialState(){
  	return {
  		borderStyle:null,
  		current:'',
  		list:[]
  	}
  },

  handleChange(e) {
	 const str = e.target.value
	 this.setState({current:str.trim()})	
  },

  handleKeyDown(e) {
	if (!this.state.current) return
	const {	current, list } = this.state
	if (e.keyCode == 32 && list.indexOf(current) == -1) {
		list.push(current)
		this.setState({	list })
    this.setState({current:''})
	  this.props.onChange(list)
	 }
  },

  handleFocus(){
  	window.addEventListener('keydown', this.handleKeyDown, false)
  	this.setState({
  		borderStyle:{border:'1px solid #2196f3'}
  	})
  },

  handleBlur(e){
  	window.removeEventListener('keydown', this.handleKeyDown, false)
  	this.setState({
  		borderStyle:{border:'1px solid #ececec'},
      current:''
  	})
  },

  remove(item){
  	const a = this.state.list
  	if(a.indexOf(item) != -1){
  		a.splice(a.indexOf(item),1)
  	}
  	this.setState({list:a})
  	this.props.onChange(a)
  },

  handleClick() {
    jQuery(ReactDOM.findDOMNode(this.refs.multipleSelectInput)).focus()
  },

  render() {  	
    return (
      <ul className="multiple-input-select" style={this.state.borderStyle} onClick={this.handleClick}>      
      	{
      		this.state.list && this.state.list.length>0 && this.state.list.map((item,i)=>{
      			return 	<li key={i}>{item}<span onClick={this.remove.bind(this,item)}>x</span></li>
      		})
      	}
  	    <li>
  	      	<input  ref="multipleSelectInput" value={this.state.current} onChange={this.handleChange}  onFocus={this.handleFocus} onBlur={this.handleBlur}/>  
  	    </li>                               
      </ul>
    )
  }
})