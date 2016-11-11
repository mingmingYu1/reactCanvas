import React from 'react'
import ReactDOM from 'react-dom'
import Highcharts from 'highcharts'
import xhr from 'bfd/xhr'

require('highcharts/modules/drilldown')(Highcharts)

export default React.createClass({

  componentDidMount() {
    this.init()
  },

  init() {
    this.chart = ReactDOM.findDOMNode(this.refs.chart)
    xhr({
      type: 'get',
      url: 'highCharts.json',
      success: this.handleSuccess
    })
  },

  handleSuccess(data) {
    const arr = [];
    for (let k in data.dMap) {
      const o = {};
      o.id = k;
      o.type = 'column';
      o.name = '退漂量';
      o.data = data.dMap[k];
      arr.push(o);
    }
    this.setChart(this.chart, data.mOutList, data.mBackList, data.mPercentList, arr)
  },
   
  getMInMax(array) {
    let _array = [];
    for(var k in array) _array.push(array[k].y);
    return {
      min:Math.floor(Math.min.apply(null, _array)),
      max: Math.ceil(Math.max.apply(null, _array))
    }
  },
  
  setChart(o, mOutList, mBackList, mPercentList, array) {
    new Highcharts.Chart({
      chart: {
        type: 'column',
        renderTo: o
      },
      colors: ['#80DEEA', '#FF8A65', '#7986CB'],
      title: {
        text: '退废票增长率',
        style: {
          color: '#000',
          fontSize: '20px',
          fontWeight: 'bold'
        }
      },
      subtitle: {
        text: "单位："+this.props.name,
        floating: true,
        align: "left",
        x: 70,
        y: 20,
        style: {
          fontSize: "14px"
        }
      },
      xAxis: {
        type: 'category',
        gridLineColor: '#D8D8D8',
        gridLineWidth: 1,
        tickLength: 0
      },
      yAxis: [
        {
          title: {
            text: '(张)',
            align: 'high',
            offset: 0,
            y: -20,
            rotation: 0,
            style: {
              color: '#89A54E',
              fontSize: "18px"
            }
          },
          labels: {
            formatter: function () {
              return this.value
            }
          },
          gridLineColor: '#D8D8D8',
          gridLineWidth: 1,
          min: 0
        }, {
          title: {
            text: '',
            style: {
              color: '#4572A7'
            }
          },
          gridLineColor: '#D8D8D8',
          gridLineWidth: 0,
          opposite: true,
          min: this.getMInMax(mPercentList).min,
          max: this.getMInMax(mPercentList).max,
          labels: {
            formatter: function () {
              return this.value * 100 + '%';
            }
          }
        }
      ],
      legend: {
        align: 'right', //水平方向位置
        verticalAlign: 'top', //垂直方向位置
        x: -40, //距离x轴的距离
        y: 0,//距离Y轴的距离
        shadow: false,
        floating: false,
        enabled: true
      },
      tooltip: {
        backgroundColor: '#607D8B',
        borderColor: '#607D8B',
        style: {
          color: '#fff'
        },
        pointFormatter: function () {
          if (this.shapeType === 'rect') {
            return this.options.y + '张';
          } else {
            return (Math.round((this.options.y) * 10000) / 100).toFixed(2) + '%'
          }
        }
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        areaspline: {
          fillOpacity: 0.5
        },
        series: {
          events: {
            //控制图标的图例legend不允许切换
            legendItemClick: function (event) {
              return false; //return  true 则表示允许切换
            }
          }
        },
        column: {
          stacking: 'normal'
        }
      },
      series: [{
        name: '出票量',
        type: 'column',
        yAxis: 0,
        data: mOutList
      }, {
        name: '退废票量',
        type: 'column',
        yAxis: 0,
        data: mBackList
      }, {
        name: '退废票率',
        type: 'spline',
        yAxis: 1,
        data: mPercentList
      }],
      drilldown: {
        series: array,
        drillUpButton: {
          relativeTo: 'spacingBox',
          position: {
            x: -250,
            y: -10
          },
          theme: {
            fill: '#00bcd4',
            'stroke-width': 1,
            stroke: 'silver',
            r: 2,
            states: {
              hover: {
                fill: '#fff'
              },
              select: {
                stroke: '#039',
                fill: '#bada55'
              }
            }
          }
        }
      }
    }).render();
  },
  
  render() {
    return (
      <div ref="chart" style={this.props.style} ></div>
    )
  }

})