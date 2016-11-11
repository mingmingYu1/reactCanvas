import React from 'react'
import { Link } from 'react-router'
import Button from 'bfd-ui/lib/Button'
import Icon from 'bfd-ui/lib/Icon'
import xhr from 'bfd-ui/lib/xhr'
import './index.less'

const  chartNav = React.createClass({
  getInitialState() {
    return {
     active:this.props.active || ""
    }
  },
  componentDidMount(){
    "use strict";
  },
  handleBtnClick(e){
    "use strict";
    console.log(e.target.dataset.key)
  },
  NodeBtnGroupClick(e){
    let  index = e.target.dataset.index
    if(index == undefined){
      index = e.target.parentNode.dataset.index
    }
    this.setState({
      active:index
    });
  },
  handleSvgDrag(ev){
    ev.dataTransfer.setData("Text",ev.target.dataset.key)
  },
  render() {

    return (
              <div className="navbar_btn">
                <ul className="pull-left">
                  <li onClick={this.handleBtnClick} ><Icon type="save" className="public-butIcon color_dodgerblue" title="保存" data-key="save" /></li>
                  <li onClick={this.handleBtnClick} ><Icon type="cloud-upload" className="public-butIcon color_blue2" title="发布" data-key="release"/></li>
                  <li onClick={this.handleBtnClick} ><Icon type="caret-square-o-right color_yellow" className="public-butIcon" title= "运行" data-key="run"/></li>
                  <li onClick={this.handleBtnClick} ><Icon type="edit" title="编辑" className="public-butIcon color_blue"  data-key="edit"/></li>
                  <li onClick={this.handleBtnClick} ><Icon type="exchange" className="public-butIcon color_darkcyan"  title="转让owner" data-key="attorn"/></li>
                  <li className = "noBorde"><Icon type="ellipsis-v" /></li>
                  <li onClick={this.handleBtnClick} ><Icon type="hand-o-right" className="public-butIcon color_blue2" title="查看运行" data-key="conduct"/></li>
                  <li onClick={this.handleBtnClick} ><Icon type="external-link"  className="public-butIcon color_blue" title="查看调度" data-key="dispatch"/></li>
                </ul>
                <div className="pull-right navTip">当前编辑人数：5人</div>
              </div>

    )
  }
})
export default chartNav