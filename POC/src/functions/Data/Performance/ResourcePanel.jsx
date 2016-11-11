import React from 'react'
import Echarts from 'echarts'
import TextOverflow from 'bfd/TextOverflow'
import xhr from 'bfd/xhr'
import Fetch from 'bfd/Fetch'
import {Row, Col} from 'bfd/Layout'

const ResourcePanel = React.createClass({  
    getInitialState(){
        return {
            type:0,
            dateType:0,
            collectType:0,
            data:[],
            amountTitle:"阅读量",
        }
    },
    colorSystem(i){
        let colors = ["#ef9a9a","#9eaadb","#82cbc7","#EEB422",
            "#f78eb2","#92cbfb","#a6d7a6","#CD950C",
            "#cf92db","#82d7fb","#c4dba3","#ffcf82",
            "#b29edb","#82dfeb","#e4e99b","#fba890"
            ];
        return colors[i]
    },
    handleTypeClick({target}) {
        this.setState({type:target.value})
    },
    handleCollectClick({target}) {
        let amountTitle="";
        if(target.value == "0") amountTitle = "阅读量";
        if(target.value == "1") amountTitle = "下载量";
        if(target.value == "2") amountTitle = "分享量";
        if(target.value == "3") amountTitle = "收藏量";
        this.setState({collectType:target.value, amountTitle:amountTitle})
    },
    handlePeriodClick({target}) {
        this.setState({dateType:target.value})
    },
    setChartOption(res){
        let myChart = Echarts.init(document.getElementById(this.props.chartId))
        let option = {
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            calculable : true,
            series : [
                {
                    name:this.props.chartTipName,
                    type:'pie',
                    radius : ['20%', '60%'],
                    center : ['50%', '50%'],
                    roseType : 'radius',
                }
            ]         
        };
        if(res.length < 11){
            res = res.slice(0,-1)
        }
        option.series[0].data = res.map((item,i) => {
                    return {"value":item.count,"name":item.name,"itemStyle":{normal:{color: this.colorSystem(i%16)}} }              
                }).sort(function (a, b) { return a.value - b.value})
        myChart.setOption(option)
        $(window).resize(function(){
            myChart.resize()
        })
    },
    shouldComponentUpdate(nextProps,nextState){       
        if( this.state.data !== nextState.data){
            this.setChartOption(nextState.data) 
            return true;
        }
        return true;
    },   
    render() {
        const LiTag = this.state.data.map((item, i) => {
            var wid = Number(item.percent)* 1.5 + 'px'
           if(item.name !== "其他"){ return (
                <li key={i} className="item">
                    <i className={"order "+(i+1 < 4 ?'top-three':'')}>{i+1}</i>
                    <TextOverflow>
                        <span className="name">{item.name}</span>
                    </TextOverflow>
                    <span className="count">{item.count}<div className="count-bar" style={{width:wid}}></div></span>
                </li>
            ) }
        })
        return (
            <div className="col-md-12 per-panel all-border">
                <Row className="per-panel-title">
                    <Col col="md-3">
                        <h3 className="title-name">{this.props.panelTitle}</h3>
                    </Col>
                    <Col col={ this.props.panel == "0"?"md-6":"md-3"}>
                        <div className="resource-type">
                            <ul>
                                <li className={this.state.type === 0 ? 'active':''} onClick={this.handleTypeClick} value="0">全部</li>
                                <li className={this.state.type === 1 ? 'active':''} onClick={this.handleTypeClick} value="1">报告</li>
                                <li className={this.state.type === 2 ? 'active':''} onClick={this.handleTypeClick} value="2">资讯</li>
                            </ul>
                        </div>
                    </Col>
                    {this.props.panel == "1" && 
                        <Col col="md-3">
                        <div className="collect-type">
                            <ul>
                                <li className={this.state.collectType === 0 ? 'active':''} onClick={this.handleCollectClick} value="0">阅读量</li>
                                <li className={this.state.collectType === 1 ? 'active':''} onClick={this.handleCollectClick} value="1">下载量</li>
                                <li className={this.state.collectType === 2 ? 'active':''} onClick={this.handleCollectClick} value="2">分享量</li>
                                <li className={this.state.collectType === 3 ? 'active':''} onClick={this.handleCollectClick} value="3">收藏量</li>
                            </ul>
                        </div>
                        </Col>
                    }
                    
                    <Col col="md-3">
                        <div className="period">
                            <ul>
                                <li className={this.state.dateType === 0 ? 'active':''} onClick={this.handlePeriodClick} value="0">最近7天</li>
                                <span>|</span>
                                <li className={this.state.dateType === 1 ? 'active':''} onClick={this.handlePeriodClick} value="1">最近30天</li>
                                <span>|</span>
                                <li className={this.state.dateType === 2 ? 'active':''} onClick={this.handlePeriodClick} value="2">全部</li>
                            </ul>                
                        </div>
                    </Col>
                </Row>

                {/*<div className="per-panel-title">
                    <h3 className="col-md-3 title-name">{this.props.panelTitle}</h3>
                    <div className="col-md-6 resource-type">
                        <ul>
                            <li className={this.state.type === 0 ? 'active':''} onClick={this.handleTypeClick} value="0">全部</li>
                            <li className={this.state.type === 1 ? 'active':''} onClick={this.handleTypeClick} value="1">报告</li>
                            <li className={this.state.type === 2 ? 'active':''} onClick={this.handleTypeClick} value="2">资讯</li>
                        </ul>
                    </div>
                    <div className="col-md-3 period">
                        <ul>
                            <li className={this.state.dateType === 0 ? 'active':''} onClick={this.handlePeriodClick} value="0">最近7天</li>
                            <span>|</span>
                            <li className={this.state.dateType === 1 ? 'active':''} onClick={this.handlePeriodClick} value="1">最近30天</li>
                            <span>|</span>
                            <li className={this.state.dateType === 2 ? 'active':''} onClick={this.handlePeriodClick} value="2">全部</li>
                        </ul>                
                    </div>
                </div>*/}

                {/*<Row className="per-panel-content">
                    <Col col={"md-6 "+(this.props.panel == "1" ? "fl-right":"")}>
                        <div className={"stat "+(this.props.panel == "1" ? "fl-right":"")}>
                            <h5 className="stat-title"><span className="order">TOP10</span><span className="name">部门名称</span><span className="count">{this.state.amountTitle}</span></h5>
                            <ul>        
                                {LiTag}
                            </ul>
                            <Fetch url={this.props.xhrUrl+'?data={"type":'+this.state.type +',"dateType":'+this.state.dateType+'}'} onSuccess={data => {this.setState({data});}}>
                            </Fetch>
                            <div className={this.state.data.length > 1 ? "has-data" : "no-data"}>
                            暂无数据
                            </div>
                        </div>
                    </Col>
                    <Col col="md-6">
                        <div className="chart " id={this.props.chartId}>            
                        </div>
                    </Col>
                </Row>*/}
               {
                    this.props.panel == "0" && 
                    <div className="col-md-12 per-panel-content">
                    <div className="col-md-6 stat ">
                        <h5 className="stat-title"><span className="order">TOP10</span><span className="name">部门名称</span><span className="count">{this.props.panel==0?"贡献量":this.state.amountTitle}</span></h5>
                        <ul>        
                            {LiTag}
                        </ul>
                        <Fetch url={this.props.xhrUrl+'?data={"type":'+this.state.type +',"dateType":'+this.state.dateType+',"collectType":'+this.state.collectType+'}'} onSuccess={data => {this.setState({data});}}>
                        </Fetch>
                        <div className={this.state.data.length > 1 ? "has-data" : "no-data"}>
                         暂无数据
                        </div>
                    </div>
                    <div className={"col-md-6 chart "} id={this.props.chartId}>            
                    </div>                    
                </div>
                }
               {
                    this.props.panel == "1" && 
                    <div className="col-md-12 per-panel-content">
                    <div className={"col-md-6 chart "} id={this.props.chartId}>            
                    </div>
                    <div className="col-md-6 stat ">
                        <h5 className="stat-title"><span className="order">TOP10</span><span className="name">部门名称</span><span className="count">{this.props.panel==0?"贡献量":this.state.amountTitle}</span></h5>
                        <ul>        
                            {LiTag}
                        </ul>
                        <Fetch url={this.props.xhrUrl+'?data={"type":'+this.state.type +',"dateType":'+this.state.dateType+',"collectType":'+this.state.collectType+'}'} onSuccess={data => {this.setState({data});}}>
                        </Fetch>
                        <div className={this.state.data.length > 1 ? "has-data" : "no-data"}>
                         暂无数据
                        </div>
                    </div>
                                        
                </div>
                }
           { /*   <div className="col-md-12 per-panel-content">
                    <div className={"col-md-6 stat "+(this.props.panel == "1" ? "fl-right":"")}>
                        <h5 className="stat-title"><span className="order">TOP10</span><span className="name">部门名称</span><span className="count">{this.props.panel==0?"贡献量":this.state.amountTitle}</span></h5>
                        <ul>        
                            {LiTag}
                        </ul>
                        <Fetch url={this.props.xhrUrl+'?data={"type":'+this.state.type +',"dateType":'+this.state.dateType+',"collectType":'+this.state.collectType+'}'} onSuccess={data => {this.setState({data});}}>
                        </Fetch>
                        <div className={this.state.data.length > 1 ? "has-data" : "no-data"}>
                         暂无数据
                        </div>
                    </div>
                    <div className={"col-md-6 chart "} id={this.props.chartId}>            
                    </div>                    
                </div>*/}
                                        
            </div>
        )
    }
})

export default ResourcePanel