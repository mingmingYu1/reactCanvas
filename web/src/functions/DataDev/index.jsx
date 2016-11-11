import React, { PropTypes } from 'react'
import { Nav, NavItem } from 'bfd/Nav'
import { Select, Option } from 'bfd-ui/lib/Select'
import Icon from 'bfd-ui/lib/Icon'
import './index.less'

export default React.createClass({
  handleChange(value) {
    console.log(value)
  },
  collapse(){
    if ($("#body").hasClass("page-sidebar-expanded")){
      $("#body").removeClass("page-sidebar-expanded").addClass("page-sidebar-collapsed")
    }else{
      $("#body").removeClass("page-sidebar-collapsed").addClass("page-sidebar-expanded")
    }
  },
  render() {
    let Children = this.props.children
    return (
    <div>
      <div className="sidebar" ref = "sidebar">
        <div className= "seachdiv">
          <Select searchable onChange={this.handleChange} className="projectSelect" value="0">
            <Option value="0" >探头管理</Option>
            <Option value="1">BDI本地化</Option>
            <Option value="2">数据仓库</Option>
          </Select>
        </div>
        <Nav href="/DataDev">
          <NavItem href="/TaskDev" icon="file-code-o" title="任务开发" />
          <NavItem href="/Adhoc" icon="search" title="即席查询" />
          <NavItem href="/FunManage" icon="code" title="函数管理" />
          <NavItem href="/ResManage" icon="server" title="资源管理" />
          <NavItem href="/DataSet" icon="cog" title="数据源设置" />
        </Nav>
        <div className="collapse-nav">
          <a className="toggle-nav-collapse" title="Open/Close" onClick={this.collapse}><Icon type="angle-left"></Icon></a>
        </div>
      </div>
      <div className="content">
          {Children}
      </div>
    </div>
    )
  }
})