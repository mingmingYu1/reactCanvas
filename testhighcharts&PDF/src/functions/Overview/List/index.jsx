import React from 'react'
import ReactDOM from 'react-dom'
import { Checkbox } from 'bfd/Checkbox'
import Table from 'public/Table'
import DataTable from 'bfd-ui/lib/DataTable'
import { Tabs, TabList, Tab, TabPanel } from 'bfd-ui/lib/Tabs'
import Icon from 'bfd-ui/lib/Icon'
import xhr from 'bfd-ui/lib/xhr'
import './index.less'

export default React.createClass({

  getInitialState() {
    return {
      column: [{
        title:'排行',
        key:'sequence'
      },{
        title: '商品名称',
        key: 'name'
      },{
        title: '历史销量',
        key: 'xl'
      },{
        title: '环比%',
        key: 'hb'
      }]
    }
  },

  handleTrClick(item, j) {
    console.log(item)
    console.log(j)
  },

  componentDidMount() {

  },

  render() {
    let name = this.props.params ? this.props.params.id : 'all'
    xhr({
      type: 'get',
      url: 'table.json?name='+name,
      success: this.handleGetTableData
    })
    return (
      <div className="function-overview-list">
        <Tabs>
          <TabList>
            <Tab>群体特征报告</Tab>
            <Tab>样例用户画像</Tab>
            <div className="pull-right aBtn">
              <a href=""><Icon type="area-chart"/></a>
              <a href=""><Icon type="list"/></a>
            </div>
          </TabList>
          <TabPanel>
            <Table onTrClick={this.handleTrClick} url={'table.json?name=dd'} showPage="false" column= { this.state.column }/>
          </TabPanel>
          <TabPanel>
            <Table onTrClick={this.handleTrClick} url={'table.json?name=sss'} showPage="false" column= { this.state.column }/>
          </TabPanel>
        </Tabs>
        <h2 ref="h2">{name}</h2>
        <Table onTrClick={this.handleTrClick} url={'table.json?name='+name} showPage="false" column= { this.state.column }/>
      </div>
    )
  }
})