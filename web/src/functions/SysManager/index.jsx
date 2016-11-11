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
          <div className="sidebar">
            <Nav href="/SysManager">
              <NavItem href="/QueueManager" icon="list" title="队列管理" />
              <NavItem href="/QueueSettings" icon="indent" title="队列分配" />
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