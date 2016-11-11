import React, { PropTypes } from 'react'
import { Nav, NavItem } from 'bfd/Nav'
import ModuleA from '../ModuleA'
import env from '../../../env'

const App2 = React.createClass({

  render() {
    let Children = this.props.children
    const active = Children ? null : 'init'
    return (
      <div className="leftNav">
        <div className="sidebar col-md-2 col-sm-3">
          <Nav href={env.basePath} className={active}>
            <NavItem href="data/moduleA" title="模块A" />
            <NavItem href="data/moduleB" title="模块B" />
          </Nav>
        </div>
        <div className="content col-md-10 col-sm-9">
          { Children || <ModuleA /> }
        </div>
      </div>
    )
  }
})

export default App2