import React from 'react'
import Task from 'public/Task'
import High from 'public/HighCharts'

export default React.createClass({

  handleClick() {
    window.open('http://credit.yodata.com/creditsupport/js/pdfjs/generic/web/viewer.html')
  },

  render() {
    const style = {
      width: '100%',
      height: '400px'
    }
    return (
      <div>
        <h1>ModuleB</h1>
        <button className="btn btn-default" onClick={this.handleClick}>测试PDF预览</button>
        <Task />
        <High style={style} name="深圳市飞骑航空票务有限公司"/>
      </div>
    )
  }
})