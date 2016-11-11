import React, { PropTypes } from 'react'
import ReactDom from 'react-dom'
import Fetch from 'bfd-ui/lib/Fetch'
import TitleTable from 'public/TitleTable'
import classNames from 'classnames'
import './index.less'

const Company = React.createClass({

  getInitialState() {
    return {
      titleUrl: 'score/titleTable.json',
      valueData: "",
      activeIndex: 1
    }
  },

  getChildContext() {
    return {
      company: this
    }
  },

  componentDidMount() {
    this.init()
  },

  init() {
    this.basePie = ReactDOM.findDOMNode(this.refs.basePie)
    this.branchPie = ReactDOM.findDOMNode(this.refs.branchPie)

    xhr({
      type: 'get',
      url: 'highCharts.json',
      success: this.handleSuccess
    })

  },

  handleSuccess(data) {
    this.setState({valueData: data})
  },

  setBasePieChart() {
    new Highcharts.Chart({
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        renderTo: dom
      },
      // 交易行为        信用历史           基本信息       履约能力           特殊事项调整
      colors: ['#BF7CFF',   '#337AB7',   '#4dd0e1',  '#328C34',   '#EAD956'],
      title: {
        text: '  '
      },
      tooltip:{
        pointFormat: '<b>{point.percentage:.1f}%</b>',
        backgroundColor:'#607D8B',
        borderColor:'#607D8B',
        style:{
            color:'#fff'
          }
        },
      legend: {
        enabled:false
      },
      credits:{
        enabled:false
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          showInLegend: true,
          dataLabels: {
            enabled: true,
            color: '#fff',
            fontSize:'12px',
            connectorColor: '#fff',
            distance: -35,
            format: '{point.percentage:.1f} %'
          },
          point:{
            events:{
              click: function(){
                switch (this.name) {
                  case '基本信息':
                    !this.selected && loadBranchPie({regId:id,type:1, algorithmType: algorithmType});
                    addActive(1);
                    break;
                  case '交易行为':
                    !this.selected && loadBranchPie({regId:id,type:2, algorithmType: algorithmType});
                    $(this).addClass('active');
                    addActive(2);
                    break;
                  case '特殊事项调整':
                    !this.selected && loadBranchPie({regId:id,type:3, algorithmType: algorithmType});
                    $(this).addClass('active');
                    addActive(3);
                    break;
                  case '信用历史':
                    !this.selected && loadBranchPie({regId:id,type:4, algorithmType: algorithmType});
                    $(this).addClass('active');
                    addActive(4);
                    break;
                  case '履约能力':
                    !this.selected && loadBranchPie({regId:id,type:5, algorithmType: algorithmType});
                    $(this).addClass('active');
                    addActive(5);
                    break;
                  default:
                    break;
                }
              }
            }
          }
        }
      },
      series: [{
        type: 'pie',
        data: array
      }]
    }).render();
  },

  setBranchPieChart() {

    new Highcharts.Chart({
      chart: {
        type: 'pie',
        renderTo: dom
      },
      title :{
        text:' '
      },
      credits:{
        enabled:false
      },
      legend: {
        enabled:false
      },
      tooltip:{
        pointFormat: '<b>{point.percentage:.1f}%</b>',
        backgroundColor:'#607D8B',
        borderColor:'#607D8B',
        style:{
          color:'#fff'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          showInLegend: true,
          dataLabels: {
            crop: false,
            enabled: true,
            color: '#fff',
            connectorColor: '#fff',
            distance: -35,
            format: '{point.percentage:.1f} %'
          }
        }
      },
      series: [{
        data: array
      }]
    }).render();
  },

  render() {
    let title1 = {
      name: '基本信息',weight: '权重',score: '得分',nameOne: '注册资本(万元',nameTwo: '注册日期',nameThree: '员工人数(人)'
    }
    let title2 = {
      name: '交易行为',weight: '权重',score: '得分',nameOne: '出票量(张)',nameTwo: '废票率',nameThree: '出票增长率'
    }
    let title3 = {
      name: '特殊事项',weight: '权重',score: '得分',nameOne: '企业法院裁定',nameTwo: '行政管理处罚',nameThree: '法人法院裁定'
    }
    let title4 = {
      name: '信用历史',weight: '权重',score: '得分',nameOne: '贷款信息',nameTwo: '信用卡信息',nameThree: '逾期信息'
    }
    let title5 = {
      name: '履约能力',weight: '权重',score: '得分',nameOne: '销售额(万元)',nameTwo: '毛利润(万元)',nameThree: '销售额增长率'
    }
    let value = this.state.valueData
    let value1, value2, value3, value4, value5
    if (value) {
      value1 = {
        weight: value.basicInfo_weight,
        score: value.basicInfo_score,
        nameOne: value.basicInfo_regAssets,
        nameTwo: value.basicInfo_openDate,
        nameThree: value.basicInfo_emps
      }
      value2 = {
        weight: value.trInfo_weight,
        score: value.trInfo_score,
        nameOne: value.trInfo_sixMVotes,
        nameTwo: value.trInfo_sixMInvalidRate,
        nameThree: value.trInfo_sixMVotesRate
      }
      value3 = {
        weight: value.specialInfo_weight,
        score: value.specialInfo_score,
        nameOne: value.specialInfo_compSpecial,
        nameTwo: value.specialInfo_special,
        nameThree: value.specialInfo_lpSpecial
      }
      value4 = {
        weight: value.creditInfo_weight,
        score: value.creditInfo_score,
        nameOne: value.creditInfo_entCreRec,
        nameTwo: value.creditInfo_lperCrecardRec,
        nameThree: value.creditInfo_ryxBusOverdueRec
      }
      value5 = {
        weight: value.capacityInfo_weight,
        score: value.capacityInfo_score,
        nameOne: value.capacityInfo_aveAmtAtkLsmon,
        nameTwo: value.capacityInfo_grossProfitOfLtyear,
        nameThree: value.capacityInfo_atkSalesIncRatioLsmon
      }
    }
    let active1 = this.state.activeIndex == 1 ? 'active' : ''
    let active2 = this.state.activeIndex == 2 ? 'active' : ''
    let active3 = this.state.activeIndex == 3 ? 'active' : ''
    let active4 = this.state.activeIndex == 4 ? 'active' : ''
    let active5 = this.state.activeIndex == 5 ? 'active' : ''
    return (
      <div className="function-company container-fluid">
        <Fetch url={this.state.titleUrl} onSuccess={this.handleSuccess} />
        {
          value ? (
            <div className='row'>
              <div className='col-xs-12'>
                <div className='row'>
                  <div className='pull-left' style={{width: '31%'}}>
                    <div>
                      <TitleTable className={active1} titleKey='1' title={title1} value={value1} style={{backgroundColor: '#4dd0e1'}}/>
                      <TitleTable className={'titleTable '+active3} titleKey='3' title={title3} value={value3} style={{backgroundColor: '#EAD956'}}/>
                    </div>
                  </div>
                  <div className='pull-left' style={{width: '39%'}}>
                    <div className='row'>
                      <div className='col-lg-7'>
                        <div ref="basePie" className="chartDom">大</div>
                      </div>
                      <div className='col-lg-5'>
                        <div ref="branchPie" className="chartDom">小</div>
                      </div>
                    </div>
                  </div>
                  <div className='pull-left' style={{width: '30%'}}>
                    <div>
                      <TitleTable className={active2} titleKey='2' title={title2} value={value2} style={{backgroundColor: '#BF7CFF'}}/>
                      <TitleTable className={'titleTable '+active4} titleKey='4' title={title4} value={value4} style={{backgroundColor: '#337AB7'}}/>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <TitleTable className={active5} titleKey='5' title={title5} value={value5} style={{backgroundColor: '#328C34'}}/>
                </div>
              </div>
            </div>
          )
            : null
        }
      </div>
    )
  }
})

Company.childContextTypes = {
  company: PropTypes.instanceOf(Company)
}

export default Company