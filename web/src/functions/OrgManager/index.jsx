import React, { PropTypes } from 'react'
import { Nav, NavItem } from 'bfd/Nav'
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
          <div className="sidebar">
            <Nav href="/OrgManager">
              <NavItem href="/MyOrg" icon="group" title="我的组织" />
              <NavItem href="/Authority" icon="anchor" title="我的权限" />
              <NavItem href="/Authentication" icon="check" title="权限审批" />
              <NavItem href="/AssignPermissions" icon="signing" title="权限分配" />
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