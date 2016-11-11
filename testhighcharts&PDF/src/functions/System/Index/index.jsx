import React, { PropTypes } from 'react'
import { Nav, NavItem } from 'bfd/Nav'
import Dept from '../Dept'
import env from '../../../env'

const App3 = React.createClass({
  render() {
    let Children = this.props.children
    const active = Children ? null : 'init'
    return (
      <div>
        <div className="sidebar col-md-2 col-sm-3 leftNav">
          <Nav href={env.basePath} className={active}>
            <NavItem href="system/dept" title="部门管理" />
            <NavItem href="system/role" title="角色管理" />
            <NavItem href="system/user" title="用户管理" />
          </Nav>
        </div>
        <div className="content col-md-10 col-sm-9">
          {Children || <Dept/>}
        </div>
      </div>
    )
  }
})

export default App3