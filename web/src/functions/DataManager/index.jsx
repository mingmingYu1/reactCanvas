import React, { PropTypes } from 'react'
import { Nav, NavItem } from 'bfd/Nav'
import './index.less'

export default React.createClass({
  render() {
    let Children = this.props.children
    return (
        <div>
          <div className="sidebar">
            <Nav href="/DataManager">
              <NavItem href="/DataOverview" icon="bar-chart" title="数据概览" />
              <NavItem href="/CreateTable" icon="table" title="表创建" />
              <NavItem href="/PermManager" icon="puzzle-piece" title="权限管理" />
              <NavItem href="/ModifyTable" icon="pencil-square-o" title="表修改" />
              <NavItem href="/ClassManager" icon="sitemap" title="类目管理" />
            </Nav>
          </div>
          <div className="content">
            {Children}
          </div>
        </div>
    )
  }
})