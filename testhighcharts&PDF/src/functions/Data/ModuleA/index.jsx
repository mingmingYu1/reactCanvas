import React from 'react'
import Fetch from 'bfd-ui/lib/Fetch'
import TitleTable from 'public/TitleTable'
import './index.less'

export default React.createClass({

  getInitialState() {
    return {
      titleUrl: '',
      valueData: ""
    }
  },

  handleSuccess(data) {
    this.setState({valueData: data})
  },

  render() {
    
    return (
      <div className="function-data-moduleA">
        <div>模块A</div> 
      </div>
    )
  }
})