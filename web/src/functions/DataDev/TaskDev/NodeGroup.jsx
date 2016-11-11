import React from 'react'
import { Link } from 'react-router'
import Button from 'bfd-ui/lib/Button'
import Icon from 'bfd-ui/lib/Icon'
import xhr from 'bfd-ui/lib/xhr'
import './index.less'


const nodeGroup= {
      "0":[{"name":"Import",key:"input"},{"name":"MR",key:"mr"},{"name":"SQL",key:"sql"},{"name":"Spark",key:"spark"},{"name":"Export","key":"output"},{"name":"聚合","key":"group"}],
      "1":[{"name":"Spark长任务",key:"sparklong"}],
      "2":[{"name":"ETL","key":"etl"}]
     }

const  NodeGroup = React.createClass({
  getInitialState() {
    return {
      type:this.props.type || ""
    }
  },
  componentDidMount(){
    "use strict";
  },
  handleClick(){
     const  nodeBox = this.refs.nodeBox;
      if (nodeBox.classList.length == 2){
          nodeBox.className = "nodeBox"
      }else{
          nodeBox.className = "nodeBox closeBox"
      }
  },
  handleSvgDrag(ev){
    ev.dataTransfer.setData("Text",ev.target.dataset.key)
  },
  render() {
    return (
        <div className="nodeBox" ref="nodeBox"><p className="nodeTitle">节点组件<Icon type="caret-down" onClick={this.handleClick}></Icon></p>
         <ul>
          {nodeGroup[this.state.type].map((node, i) => {
            return (
                <li draggable="true" onDragStart={this.handleSvgDrag} data-key={node.key} title={node.name}><div className ={"icon_"+node.key}></div><div>{node.name}</div></li>
            )
          })}
        </ul></div>
    )
  }
})
export default NodeGroup