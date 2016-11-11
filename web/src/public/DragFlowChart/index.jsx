import React from 'react'
import Chart from 'bfd-ui/lib/Chart'
import FlowChart from './main'
import Slider from 'bfd-ui/lib/Slider'
import './index.less'

export default React.createClass({
  getInitialState() {
    return {
      data: this.props.data
    }
  },
  handleSliding(value) {

  },
  handleStopDrop(ev){
      ev.preventDefault();
      ev.stopPropagation();
  },
  handleSlid(value) {
      this.state.data.scale = parseFloat(value)<0.2?0.2:parseFloat(value);
      this.state.data.translate=[0,0];
      const  center =$("#flowchart"+this.props.index+ " > g");
      center.attr("transform", "translate(" + this.state.data.translate + ")scale(" + this.state.data.scale+ ")");
  },
  render() {
    const { data, ...other } = this.props
    return <div>
           <Chart ref="FlowChart" type={FlowChart}  data={data} className="bubble-chart"  {...other} />
           <div className="flowslider" onDrop={this.handleStopDrop}>
            <Slider defaultValue={1} tickValue={2} start={0} end={2} suffix="" onSliding={this.handleSliding} onSlid={this.handleSlid} />
            </div>
           </div>

  }
})