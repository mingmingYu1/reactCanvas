import React from 'react'
import Tree from 'public/Tree'
import { Link } from 'react-router'
import SearchInput from 'public/SearchInput'
import DragLine from "public/DragLine"
import './index.less'

var  SeachTree = React.createClass({
  TreeSeachlist: [],
  getInitialState() {
    return {
      seachval:""
    }
  },
  handleChange(val){
    if (val == ""){
      this.handleSeach(val);
    }
  },
  handleSeach(val){
    if(val !== this.state.seachval)
    this.setState({
      seachval:val
    });
  },
  getTreeWithSeach(data) {
    const _this = this;
    _this.TreeSeachlist = [];
    data.map(function(d) {
      if (d.name.indexOf(_this.state.seachval) > -1 || _this.state.seachval == ""){
        _this.TreeSeachlist.push(d);
      }else{
        if (d.children !== undefined){
          _this.getTreeWithSeach(d.children)
        }
      }
    })
     return _this.TreeSeachlist
  },
  getIcon(data) {
    if(this.props.getIcon){
      return this.props.getIcon(data)
    }
    else{
      return data.open== undefined?"sitemap":data.open?'folder-open' : 'folder'
    }
  },
  render() {
    const { getIcon,defaultData, ...other } = this.props
    const  TreeData =this.getTreeWithSeach(defaultData);
    return (
        <div className="treebox" ref="treeBox">
          <SearchInput placeholder="请输入任务名称"  className="seachTree" size="sm" onChange={this.handleChange}  onSearch={this.handleSeach} />
          <Tree data={TreeData} getIcon={this.getIcon} { ...other}/>
        </div>
    )
  }
})
export default SeachTree