import './index.less'
import React from 'react'
import ReactDOM from 'react-dom'
import echarts from 'echarts'

export default React.createClass({

  componentDidUpdate(){
		this.handleData()
  },

  handleData() {
	const { config ,title ,color} = this.props;

	if (this.isEmptyObject(config))	return

	const option = {
		title: {
			text: title,
			textStyle:{					
				fontSize:13,
				fontWeight:'bold'
			},
			padding: [0, 20]
		},
		color:color,
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			data: config.series.map(function(item,i){
				return item.name
			}),
			left:'right',
			padding: [
			    10,  // 上
			    40, // 右
			    5,  // 下
			    10, // 左
			]
		},
		toolbox: {
			feature: {
				saveAsImage: {}
			}
		},
		grid: {				
			left: '5%',
			right: '5%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: [{
			type: 'category',
			name:'时间',
			boundaryGap: false,
			data: config.xData 
		}],
		yAxis: [{
			type: 'value'
		}],
		series: config.series.map(function(item,i){
			return {
				name: item.name,
				type: 'line',
				stack: '总量',
				areaStyle: {
					normal: {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
							  offset: 0, color: color && color[i] 
							}, {
							  offset: 1, color: '#fff'
							}], false)
					}
				},
				data: item.data
			}
		})
	}
	const myChart = echarts.init(ReactDOM.findDOMNode(this.refs.pocLineChart))
	myChart.setOption(option)
	$(window).resize(function(){
			myChart.resize()
		})
  },  
  shouldComponentUpdate(nextProps, nextState){
	return this.props.config !== nextProps.config
  },

  isEmptyObject(e) {  
    let t;  
    for (t in e)  
        return !1;  
    return !0  
  },

  render() {
	const _height = {
		height: this.props.height
	}
    return (
      <div style={_height} ref="pocLineChart"></div>
    )
  }
})