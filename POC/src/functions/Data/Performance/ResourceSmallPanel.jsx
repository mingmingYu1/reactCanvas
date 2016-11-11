import React from 'react'
import ReactDOM from 'react-dom'
import Echarts from 'echarts'
import xhr from 'bfd/xhr'
import Fetch from 'bfd/Fetch'
import {Row, Col} from 'bfd/Layout'

 let pieData=[];
const ResourceSmallPanel = React.createClass({ 
  
    getInitialState(){
        return {
            type:0,
            id:-1,
            isShowNodata:true,
            "data":{
                "nodes": [],
                "edges": [],
                "outerPie":[],
                "innerPie":[]
            }
        }
    },
    colorSystem(i){
        let colors = ["#ef9a9a","#9eaadb","#82cbc7","#EEB422",
            "#f78eb2","#92cbfb","#a6d7a6","#CD950C",
            "#cf92db","#82d7fb","#c4dba3","#ffcf82",
            "#b29edb","#82dfeb","#EEB422","#fba890"
            ];
        return colors[i]
    },
    handleTypeClick({target}) {
       this.setState({"type":target.value,id:-1,isShowNodata:true})
    },
    setChartOption(res){
        let myChart = Echarts.init(document.getElementById(this.props.chartId))     
        let option = this.getChartOption();
        let _this = this;
        switch(this.props.chartType){
               case "pie":            
                    if(!res.outerPie || !res.innerPie || res.outerPie.length === 0) {        
                        return;
                    }                                  
                    option.legend.data = res.innerPie.map((item,i) => {
                        return {"name":item.name}
                    });                        
                    var data_in = res.innerPie.map((item,i) => {
                        return {"id":item.id,"value":item.value,"name":item.name,"itemStyle":{normal:{color: this.colorSystem(i%16)}} }
                    });
                     var data_ou = res.outerPie.map((item,i) => {
                        return {"id":item.id,"value":item.value,"name":item.name,"itemStyle":{normal:{color: this.colorSystem(i%16)}} }
                    });
                    option.series[0].data = data_in
                    option.series[1].data = data_ou
                    myChart.setOption(option);
                    myChart.on('click', function(params){        
                      //  pieData.push(res)
                        _this.setState({id:params.data.id,isShowNodata:false})
                        
                    })
                break;
                case "graph":
                    if(!res.nodes || res.nodes.length === 0) {
                        return;
                    }
                    let percent = this.getSizePercent(res.nodes);
                    option.series[0].data = res.nodes.map(function (node,i) {
                        return {
                            x: Math.random()*100,
                            y: Math.random()*100,
                            id: node.id,
                            name: node.label,
                            symbolSize: node.size*percent,
                            itemStyle: {
                                normal: {
                                    color: _this.colorSystem(i%16)
                                }
                            }
                        };
                    }),
                    option.series[0].edges = res.edges.map(function (edge) {
                        return {
                            source: edge.sourceId,
                            target: edge.targetId
                        };
                    }),
                    myChart.setOption(option)
                break;
            }

        $(window).resize(function(){
            myChart.resize()
        })
    },
    getChartOption(){
        let optionPie = {
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient:"vertival",
                    x : 'right',
                    y : 'bottom',
                    itemGap:1,
                    itemHeight:10,
                    textStyle:{
                        fontSize:10
                    }
                },
                calculable : true,
                series : [
                    {
                        name:this.props.chartTipName,
                        type:'pie',
                        radius: [0, '15%'],
                    },
                    {
                        name:this.props.chartTipName,
                        type:'pie',
                        radius: ['20%', '60%'],
                    }
                ],
                
            };
        let optionGraph = {
                animationDurationUpdate: 1500,
                animationEasingUpdate: 'quinticInOut',
                series : [
                    {
                        type: 'graph',
                        layout: 'none',
                        // progressiveThreshold: 700,
                        label: {
                            emphasis: {
                                position: 'right',
                                show: true
                            }
                        },
                        roam: true,
                        focusNodeAdjacency: true,
                        lineStyle: {
                            normal: {
                                width: 2,
                                curveness: 0.3,
                                opacity: 0.7
                            }
                        }
                    }
                ],
               
            }
            if(this.props.chartType === 'pie'){
                return optionPie;
            }else if(this.props.chartType === 'graph'){
                return optionGraph;
            }
    },   
    getSizePercent(nodes){
        let maxsize=parseInt(nodes[0].size) ; 
        for(var i = 1; i < nodes.length; i++){
             maxsize = maxsize < parseInt(nodes[i].size) ? parseInt(nodes[i].size) : maxsize
        }
        /*nodes.reduce(function(a, b){
            if(a){
                maxsize = a.size
            }else{
                maxsize = maxsize < b.size ? b.size : maxsize
            }  
        })*/
        let chart = ReactDOM.findDOMNode(this.refs[this.props.chartId])
        let minwidth = Math.min(chart.clientWidth,chart.clientHeight)
        let percent=1;
        if(maxsize > minwidth /2){
            percent = minwidth / maxsize / 2
        }
        if(maxsize < 10){
            percent = 5;
        }
        return percent
    },
    shouldComponentUpdate(nextProps, nextState){
        if(this.state.data !== nextState.data){
            this.setChartOption(nextState.data)
            return true
        }
        return true
    },
    restorePie(){
        if(pieData.length > 0){
            this.setState({data:pieData.pop()});
         }       
    },
    onSuccess(data){
      //  this.setState({data:data})
       /*
       ****不显示暂无数据的逻辑
       */
        if(this.props.chartType=="pie" ){
            if(!this.state.isShowNodata){
                pieData.push(this.state.data)
            }
            if(data.outerPie.length == 0 ){
                pieData.pop()
                return;
            }
        }
        this.setState({data:data})
    },
    render() {
        return (
            <div className="col-md-12 per-panel all-border">
                <Row className="per-panel-title">
                    <Col col="md-8">
                        <h3 className="title-name">{this.props.panelTitle}</h3>
                    </Col>
                    <Col col="md-4">
                        <div className="resource-type">
                            <ul>
                                <li className={this.state.type === 0 ? 'active':''} onClick={this.handleTypeClick} value="0">全部</li>
                                <li className={this.state.type === 1 ? 'active':''} onClick={this.handleTypeClick} value="1">报告</li>
                                <li className={this.state.type === 2 ? 'active':''} onClick={this.handleTypeClick} value="2">资讯</li>
                            </ul>
                            <Fetch url={this.props.xhrUrl+'?data={"type":'+this.state.type +",id:"+this.state.id+'}'} onSuccess={this.onSuccess}>
                            </Fetch>
                        </div>
                    </Col>   
                </Row>
                {/*<div className="per-panel-title">
                    <h3 className="col-md-8 title-name">{this.props.panelTitle}</h3>
                    <div className="col-md-4 resource-type">
                        <ul>
                            <li className={this.state.type === 0 ? 'active':''} onClick={this.handleTypeClick} value="0">全部</li>
                            <li className={this.state.type === 1 ? 'active':''} onClick={this.handleTypeClick} value="1">报告</li>
                            <li className={this.state.type === 2 ? 'active':''} onClick={this.handleTypeClick} value="2">资讯</li>
                        </ul>
                        <Fetch url={this.props.xhrUrl+'?data={"type":'+this.state.type +'}'} onSuccess={data => {this.setState({data})}}>
                        </Fetch>
                    </div>
                </div>*/}
                <div className="per-panel-content">
                    {  this.props.panelTitle == "资源分布" && <div className="back"><a onClick={this.restorePie}>返回</a></div>  }
                    <div className="col-md-12 chart " id={this.props.chartId} ref={this.props.chartId}>
                        
                    </div>
                   <div ref="noData" className={"col-md-12 "+((this.props.chartType=="pie" && this.state.data.outerPie.length > 0 || this.props.chartType=="graph" && this.state.data.nodes.length > 0 )  ? "has-data" : "no-data")} >
                        暂无数据
                   </div>
                </div> 
            </div>
        )
    }
})

export default ResourceSmallPanel