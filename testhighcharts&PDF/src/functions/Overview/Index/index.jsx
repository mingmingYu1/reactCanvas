import React, { PropTypes } from 'react'
import { Nav, NavItem } from 'bfd/Nav'
import xhr from 'bfd-ui/lib/xhr'
import List from '../List'
import env from '../../../env'

export default React.createClass({

  getInitialState() {
    return {
      data: []
    }
  },

  componentDidMount() {
    xhr({
      type: 'get',
      url: 'nav.json',
      success: this.handleSuccess
    })
  },

  handleSuccess(data) {
    this.setState({data})
  },

  render() {
    let Children = this.props.children
    const active = Children ? null : 'init'
    return (
      <div className="">
        <div className="sidebar col-md-2 col-sm-3 leftNav">
          <Nav href={env.basePath} className={active}>
            <NavItem href="overview/list/all" title="全部分类(TOP20)"/>
            {
              this.state.data.map(
                (item, i) => <NavItem title={item.name+'(TOP10)'} key={i} href={'overview/list/'+item.id}/>
              )
            }
          </Nav>
        </div>
        <div className="content col-md-10 col-sm-9">
          { Children || <List />}
        </div>
      </div>
    )
  }
})
