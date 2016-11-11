import React from 'react'
import { Link } from 'react-router'
import xhr from 'bfd/xhr'
import Fetch from 'bfd/Fetch'
import TextOverflow from 'bfd/TextOverflow'
import {Row, Col} from 'bfd/Layout'

const RankingPanel = React.createClass({
  getInitialState(){
    return {
      dateType:0,
      xhrUrl:this.props.xhrUrl,
      "data":[]
    }
  },
  handleRowClick(row){
     //this.props.history.pushState({id:id},'/data/details');  
     window.location.href = "/data/details?id="+row.id;
  },
  handlePeriodClick({target}) {
    this.setState({dateType:target.value})
  },  
  render() {
    const LiTag = this.state.data.map((item, i) => {
            return (
                <li key={i} className="item" onClick={this.handleRowClick.bind(this,item)}>
                  {/*<Link to={"/data/details?id="+item.id}>*/}
                    <i className={"order "+(i+1 < 4 ?'top-three':'')}>{i+1}</i>
                    <TextOverflow><span className="item-name">{item.name}</span></TextOverflow>
                    <span className="item-count fl-right">{item.count}</span>
                 {/* </Link>*/}
                </li>
            )
        });

    return (
        <div className="per-panel all-border">
          <Row className="per-panel-title">
            <Col col="md-7">
              <h4 className="title-name">{this.props.rankingTitle}</h4>
            </Col>
            <Col col="md-5">
              <div className="period">
                <ul>
                  <li className={this.state.dateType === 0 ? 'active':''} onClick={this.handlePeriodClick} value="0">最近7天</li>
                  <span>|</span>
                  <li className={this.state.dateType === 1 ? 'active':''} onClick={this.handlePeriodClick} value="1">最近30天</li>
                  <span>|</span>
                  <li className={this.state.dateType === 2 ? 'active':''} onClick={this.handlePeriodClick} value="2">全部</li>
                </ul> 
                <Fetch url={this.state.xhrUrl+'?data={"dateType":'+this.state.dateType+'}'} onSuccess={data => {this.setState({data})}}>
                </Fetch>  
              </div>
            </Col>
          </Row>
                      {/*<div className="per-panel-title">
                        <h4 className="col-md-7 title-name">{this.props.rankingTitle}</h4>
                        <div className="col-md-5 period">
                          <ul>
                            <li className={this.state.dateType === 0 ? 'active':''} onClick={this.handlePeriodClick} value="0">最近7天</li>
                            <span>|</span>
                            <li className={this.state.dateType === 1 ? 'active':''} onClick={this.handlePeriodClick} value="1">最近30天</li>
                            <span>|</span>
                            <li className={this.state.dateType === 2 ? 'active':''} onClick={this.handlePeriodClick} value="2">全部</li>
                          </ul> 
                          <Fetch url={this.state.xhrUrl+'?data={"dateType":'+this.state.dateType+'}'} onSuccess={data => {this.setState({data})}}>
                          </Fetch>  
                        </div>
                      </div>*/}
                      
          <div className="col-md-12 stat">
            <h5 className="stat-title"><span className="order">TOP10</span><span className="name">资源名称</span><span className="count">{this.props.amountTitle}</span></h5>
            <ul>        
              {LiTag}
            </ul>
            <div className={this.state.data.length > 0 ? "has-data" : "no-data"}>
              暂无数据
            </div>
          </div>
        </div>
      )
  }
})

export default RankingPanel