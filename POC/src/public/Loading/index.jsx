import React from 'react'
import './index.less'
import emitter from '../../eventEmitter'

export default React.createClass({
  getInitialState() {
    return {
      loading: false
    }
  },
  componentWillMount() {
  	 emitter.on("loading-false", () =>{
      this.setState({ loading: false })
    })
    emitter.on("loading-true", () =>{
      this.setState({ loading: true })
    })
  },
  render() { 
  	if(this.state.loading) {
		const {	icon, text } = this.props	
  		return (
  			<div className="loading-box">
				<div className="loading-content">
				  {	icon ? <img src={icon}/> : null }	
				  {	text ? <span>{text}</span> : null }									
				</div>
			</div>
  		)
  	}else{
  		return null
  	}    
  }
})