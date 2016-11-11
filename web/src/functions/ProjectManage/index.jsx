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
            <Nav href="/ProjectManage">
              <NavItem href="/MyProject" icon="group" title="我的项目" />
              <NavItem href="/ProjectList" icon="anchor" title="项目管理" />
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