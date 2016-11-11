import './index.less'
import React from 'react'
import ReactDOM from 'react-dom'
import echarts from 'echarts'

export default React.createClass({

	componentDidUpdate (){
		this.handleData()
	}, 

	handleData() {

		const {	title,	config,	color } = this.props
		if (this.isEmptyObject(config)) return
		let option = {
			title: {
				text: title,
				textStyle: {
					fontSize: 13,
					fontWeight: 'bold'
				},
				padding: [0, 20]
			},
			tooltip: {},
			legend: {
				data: config.data.map((item, i) => {
					return {
						name: item.name,
						icon: 'image://' + require(`./${i+1}.png`)
					}
				}),
				orient: 'vertical',
				x: 'right',
				padding: [60, 20],
				itemWidth: 18
			},
			radar: config.radar,
			series: [{
				type: 'radar',
				data: config.data.map((item, i) => {
					return {
						value: item.value,
						name: item.name,
						areaStyle: {
							normal: {
								color: new echarts.graphic.LinearGradient(0, 1, 1, 0, [{
									offset: 0,
									color: color[i]
								}, {
									offset: 1,
									color: '#fff'
								}], false)
							}
						}
					}
				})
			}]
		}
		if (color) option.color = color
		const myChart = echarts.init(ReactDOM.findDOMNode(this.refs.leida))
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
			height:this.props.height
		}
	    return (
	      <div className="poc-radar-chart" style={_height} ref="leida"></div>
	    )
	}
})