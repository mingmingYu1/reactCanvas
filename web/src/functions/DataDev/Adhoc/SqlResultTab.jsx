import React from 'react'
import { Link } from 'react-router'
import Button from 'bfd-ui/lib/Button'
import ReactDOM from 'react-dom'
import Icon from 'bfd-ui/lib/Icon'
import TabTable from './TabTable.jsx'
import DragLine from "public/DragLine"
import { Tabs, TabList, Tab, TabPanel } from 'bfd-ui/lib/Tabs'

import xhr from 'bfd-ui/lib/xhr'

import './index.less'

const  SqlResultTab = React.createClass({
  open:false,
  DragingLine(position){
    this.props.DragingLine && this.props.DragingLine("tab",position)
  },
  handleIconClick(e){
    "use strict";
    const type = e.target.dataset.type;
   const  iconGroup = e.target.parentNode.childNodes;
    if (!this.open && type == "open"){
      this.open=!this.open
      e.target.className = "icon x-open-icon icon-hide";
      iconGroup[1].className = "icon x-close-icon";
      this.props.DragingLine && this.props.DragingLine("tab",{y:-220})
    }else if (this.open && type == "close"){
      this.open=!this.open
      e.target.className ="icon x-close-icon icon-hide";
      iconGroup[0].className = "icon x-open-icon";
      this.props.DragingLine && this.props.DragingLine("tab",{y:380})
    }

  },
  render() {
    return (
        <Tabs>
          <DragLine onDraging={this.DragingLine}/>
          <div className="x-open-close-container">
            <i className="icon x-open-icon" data-type="open" onClick={this.handleIconClick}/>
            <i className="icon x-close-icon icon-hide" data-type="close"  onClick={this.handleIconClick}/>
          </div>
          <TabList>
            <Tab>控制台输出</Tab>
            <Tab>查询结果</Tab>
            <Tab>历史记录</Tab>
          </TabList>
          <TabPanel>1
          </TabPanel>
          <TabPanel>2
          </TabPanel>
          <TabPanel>3
          </TabPanel>
        </Tabs>

    )
  }
})

export default SqlResultTab