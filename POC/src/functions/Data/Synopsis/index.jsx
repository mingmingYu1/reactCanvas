import React from 'react'
import { Link } from 'react-router'
import Tree from 'bfd/Tree'
import xhr from 'public/xhr'
import URL from 'public/url'
import { Select, Option } from 'bfd/Select'
import { DatePicker } from 'antd'
import DataTable from 'bfd/DataTable'
// import MoreCondition from './MoreCondition'
import TableOperation from './TableOperation'
import TextOverflow from 'bfd/TextOverflow'
import ShareModal from 'public/ShareModal'
import classNames from 'classnames'
import SearchBox from './SearchBox'
import './index.less'

const RangePicker = DatePicker.RangePicker

export default React.createClass({

    
  getInitialState() {
    // console.log('-----',this.props.params.searchWord)
    return {
      //参数
      searchValue: (this.props.location.query.searchWord ? this.props.location.query.searchWord : ''),

      // 树
      sourceInfoData: [],
      newspaperMedia: [],
      thirdInfoData: [],
      mainInfoData: [],
      electronicJournal: [],

      // 原始树结构数据
      initialSourceInfoData: [],
      initialNewspaperMedia: [],
      initialThirdInfoData: [],
      initialMainInfoData: [],
      initialElectronicJournal: [],
      tableData: [],

      // 热门主题分类下拉
      hotType: [],

      // 刊发频次
      publishFrequence: [],

      // 语种
      language: [],

      // 下拉选择
      // tab 综合排序 最新上传
      rankOrUpload: 1,

      chooseSourceFrom: '',
      chooseNewspaperMedia: '',
      chooseThridInfo: '',
      chooseProduct: '',
      chooseElectronicJournal: '',
      chooseSourceType: '',
      chooseHotType: '',
      choosePublishFrequence: '',
      chooseLanguage: '',
      chooseTime: ['', ''],
      chooseMoreTypeIds: '',


      // 日历
      calendarTime: '自定义时间',

      // share modal
      modalData: {
        id: '',
        visible: false
      },

      // 表格
      tableData: {},
      column: [{
        title:'发布时间',
        width: '145px',
        key:'create_time',
        render: (text) => {
          let myTime = text
          let arr = text.split(' ')
          if (arr[1] == '00:00:00') {
            myTime = arr[0]
          }
          return (
            <div>{myTime}</div>
          )
        }
      }, {
        title: '标题',
        key: 'name',
        render: (text, item) => {
          function createMarkup() { 
            return {__html: text}
          }
          return (
            <div className="article-tit">
              <i className={classNames({'fa': true,'fa-file-pdf-o': (item.type == 'PDF'), 'fa-file-word-o': (item.type == 'WORD'), 'fa-file-text-o': (item.type == 'CONSULTING')})}></i>
              <Link className="article-tit-con" to='/data/details' query={{id: item.id}} target="_blank" >
                <div className="article-tit-text" dangerouslySetInnerHTML={createMarkup()}/>
              </Link>
            </div>
          )
        }
      }, {
        title: '上传者',
        key: 'create_user_name',
        render: (text) => {
          return (
            <TextOverflow>
              <div className="synopsis-table-author">{text}</div>
            </TextOverflow>
          )
        }
      }, {
        title: '来源',
        key: 'category_source',
        render: (text) => {
          return (
            <div className="synopsis-table-source">{text}</div>
          )
        }
      }, {
        title: '定价',
        key: 'price',
        render: (text) => {
          return (
            <TextOverflow>
              <div className="synopsis-table-price">{text ? text : 0}</div>
            </TextOverflow>
          )
        }
      }, {
        title: '操作',
        width: '100px',
        key: 'operation',
        /**
         * @param item  当前数据对象
         * @param component 当前
         * @returns {XML}  返回dom对象
         */
        render:(item, component)=> {
          return (
            <div className="synopsis-table-operation">
              <TableOperation data={item} showModal={this.showShareModal.bind(this, item.id)}></TableOperation>
            </div>
          )
        },
        key: 'operation'//注：operation 指定为操作选项和数据库内字段毫无关联，其他key 都必须与数据库内一致
      }]
    }
  },

  // 分享 modal
  showShareModal(id) {
    let modalData = this.state.modalData
    modalData.visible = true
    modalData.id = id
    this.setState({
      modalData: modalData
    })
  },

  handleShareModalCancel() {
    let modalData = this.state.modalData
    modalData.visible = false
    this.setState({
      modalData: modalData
    })
  },

  changeBoolean(data) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].active) {
        data[i].active = false
      }
      if (data[i].open) {
        data[i].open = false
      }
      if (data[i].children) {
        this.changeBoolean(data[i].children)
      } 
    }
    return data
  },

  // 中经社
  sourceInfoActive(data) {
    let codeStr = ''

    // 第一层级点击事件
    if (data.length == 1) {
      let childrenCode = (data) => {
        let codeStr = ''
        for (let i = 0; i < data.children.length; i++) {
          for (let j = 0; j < data.children[i].children.length; j++) {
            codeStr += data.children[i].children[j].code + ','
          }
        }
        return codeStr
      }

      codeStr = childrenCode(data[0])
    }

    // 第二级点击事件
    if (data.length == 2) {
      let childrenCode = (data) => {
        let codeStr = ''
        for (let i = 0; i < data.children.length; i++) {
          codeStr += data.children[i].code + ','
        }
        return codeStr
      }

      codeStr = childrenCode(data[1])
    }

    // 第三级点击事件
    if (data.length > 2) {
      codeStr = (data.length > 1 ? data[(data.length-1)].code : '')
    }

    this.setState({
      sourceInfoData: [data[0]],
      newspaperMedia: this.state.initialNewspaperMedia,
      thirdInfoData: this.state.initialThirdInfoData,
      mainInfoData: this.state.initialMainInfoData,
      electronicJournal: this.state.initialElectronicJournal,
      chooseSourceFrom: codeStr,
      chooseNewspaperMedia: '',
      chooseThridInfo: '',
      chooseProduct: '',
      chooseElectronicJournal: '',
    })

    // 表格数据
    this.synopsisXhr({
      searchWord: this.state.searchValue,
      sourceFrom: codeStr,
      newspaperMedia: '',
      thridInfo: '',
      product: '',
      electronicJournal: '',
      orderType: this.state.rankOrUpload,
      theme: (parseInt(this.state.chooseHotType) ? this.state.chooseHotType : ''),
      from: this.state.chooseTime[0],
      to: this.state.chooseTime[1],
      language: (parseInt(this.state.chooseLanguage) ? this.state.chooseLanguage : ''),
      sourceType: (parseInt(this.state.chooseSourceType) ? this.state.chooseSourceType : ''),
      type: (parseInt(this.state.choosePublishFrequence) ? this.state.choosePublishFrequence : ''),
      moreTypeIds: this.state.chooseMoreTypeIds
    })
  },

  // 报刊媒体
  newspaperMediaActive(data) {
    let codeStr = ''

    // 第一层点击事件
    if (data.length == 1) {
      let childrenCode = (data) => {
        let codeStr = ''
        for (let i = 0; i < data.children.length; i++) {
          codeStr += data.children[i].code + ','
        }
        return codeStr
      }

      codeStr = childrenCode(data[0])
    }

    // 第二级点击事件
    if (data.length > 1) {
      codeStr = (data.length > 1 ? data[(data.length-1)].code : '')
    }

    this.setState({
      sourceInfoData: this.state.initialSourceInfoData,
      newspaperMedia: [data[0]],
      thirdInfoData: this.state.initialThirdInfoData,
      mainInfoData: this.state.initialMainInfoData,
      electronicJournal: this.state.initialElectronicJournal,
      chooseSourceFrom: '',
      chooseNewspaperMedia: codeStr,
      chooseThridInfo: '',
      chooseProduct: '',
      chooseElectronicJournal: ''
    })

    // 表格数据
    this.synopsisXhr({
      searchWord: this.state.searchValue,
      sourceFrom: '',
      newspaperMedia: codeStr,   
      thridInfo: '',
      product: '',
      electronicJournal: '',
      orderType: this.state.rankOrUpload,
      theme: (parseInt(this.state.chooseHotType) ? this.state.chooseHotType : ''),
      from: this.state.chooseTime[0],
      to: this.state.chooseTime[1],
      language: (parseInt(this.state.chooseLanguage) ? this.state.chooseLanguage : ''),
      sourceType: (parseInt(this.state.chooseSourceType) ? this.state.chooseSourceType : ''),
      type: (parseInt(this.state.choosePublishFrequence) ? this.state.choosePublishFrequence : ''),
      moreTypeIds: this.state.chooseMoreTypeIds
    })
  },

  // 第三方信息
  thirdInfoActive(data) {
    let codeStr = ''

    // 第一层点击事件
    if (data.length == 1) {
      let childrenCode = (data) => {
        let codeStr = ''
        for (let i = 0; i < data.children.length; i++) {
          codeStr += data.children[i].code + ','
        }
        return codeStr
      }

      codeStr = childrenCode(data[0])
    }

    // 第二级点击事件
    if (data.length > 1) {
      codeStr = (data.length > 1 ? data[(data.length-1)].code : '')
    }

    this.setState({
      sourceInfoData: this.state.initialSourceInfoData,
      newspaperMedia: this.state.initialNewspaperMedia,
      thirdInfoData: [data[0]],
      mainInfoData: this.state.initialMainInfoData,
      electronicJournal: this.state.initialElectronicJournal,
      chooseSourceFrom: '',
      chooseNewspaperMedia: '',
      chooseThridInfo: codeStr,
      chooseProduct: '',
      chooseElectronicJournal: '',
    })

    // 表格数据
    this.synopsisXhr({
      searchWord: this.state.searchValue,
      sourceFrom: '',
      newspaperMedia: '',
      thridInfo: codeStr,
      product: '',
      electronicJournal: '',
      orderType: this.state.rankOrUpload,
      theme: (parseInt(this.state.chooseHotType) ? this.state.chooseHotType : ''),
      from: this.state.chooseTime[0],
      to: this.state.chooseTime[1],
      language: (parseInt(this.state.chooseLanguage) ? this.state.chooseLanguage : ''),
      sourceType: (parseInt(this.state.chooseSourceType) ? this.state.chooseSourceType : ''),
      type: (parseInt(this.state.choosePublishFrequence) ? this.state.choosePublishFrequence : ''),
      moreTypeIds: this.state.chooseMoreTypeIds
    })
  },

  // 主打产品
  mainInfoActive(data) {
    let codeStr = ''

    // 第一级点击事件
    if (data.length == 1) {
      let childrenCode = (data) => {
        let codeStr = ''
        for (let i = 0; i < data.children.length; i++) {
          codeStr += data.children[i].ref_id + ','
        }
        return codeStr
      }

      codeStr = childrenCode(data[0])
    }

    // 第二级点击事件
    if (data.length > 1) {
      codeStr = (data.length > 1 ? data[(data.length-1)].ref_id : '')
    }

    this.setState({
      sourceInfoData: this.state.initialSourceInfoData,
      newspaperMedia: this.state.initialNewspaperMedia,
      thirdInfoData: this.state.initialThirdInfoData,
      mainInfoData: [data[0]],
      electronicJournal: this.state.initialElectronicJournal,
      chooseSourceFrom: '',
      chooseNewspaperMedia: '',
      chooseThridInfo: '',
      chooseProduct: codeStr,
      chooseElectronicJournal: '',
    })

    // 表格数据
    this.synopsisXhr({
      searchWord: this.state.searchValue,
      sourceFrom: '',
      newspaperMedia: '',
      thridInfo: '',
      product: codeStr,
      electronicJournal: '',
      orderType: this.state.rankOrUpload,
      theme: (parseInt(this.state.chooseHotType) ? this.state.chooseHotType : ''),
      from: this.state.chooseTime[0],
      to: this.state.chooseTime[1],
      language: (parseInt(this.state.chooseLanguage) ? this.state.chooseLanguage : ''),
      sourceType: (parseInt(this.state.chooseSourceType) ? this.state.chooseSourceType : ''),
      type: (parseInt(this.state.choosePublishFrequence) ? this.state.choosePublishFrequence : ''),
      moreTypeIds: this.state.chooseMoreTypeIds
    })
  },

  // 电子期刊
  electronicJournalActive(data) {
    let codeStr = ''

    // 第一层点击事件
    if (data.length == 1) {
      let childrenCode = (data) => {
        let codeStr = ''
        for (let i = 0; i < data.children.length; i++) {
          codeStr += data.children[i].code + ','
        }
        return codeStr
      }

      codeStr = childrenCode(data[0])
    }

    // 第二级点击事件
    if (data.length > 1) {
      codeStr = (data.length > 1 ? data[(data.length-1)].code : '')
    }

    this.setState({
      sourceInfoData: this.state.initialSourceInfoData,
      newspaperMedia: this.state.initialNewspaperMedia,
      thirdInfoData: this.state.initialThirdInfoData,
      mainInfoData: this.state.initialMainInfoData,
      electronicJournal: [data[0]],
      chooseSourceFrom: '',
      chooseNewspaperMedia: '',
      chooseThridInfo: '',
      chooseProduct: '',
      chooseElectronicJournal: codeStr
    })

    // 表格数据
    this.synopsisXhr({
      searchWord: this.state.searchValue,
      sourceFrom: '',
      newspaperMedia: '',
      thridInfo: '',
      product: '',
      electronicJournal: codeStr,
      orderType: this.state.rankOrUpload,
      theme: (parseInt(this.state.chooseHotType) ? this.state.chooseHotType : ''),
      from: this.state.chooseTime[0],
      to: this.state.chooseTime[1],
      language: (parseInt(this.state.chooseLanguage) ? this.state.chooseLanguage : ''),
      sourceType: (parseInt(this.state.chooseSourceType) ? this.state.chooseSourceType : ''),
      type: (parseInt(this.state.choosePublishFrequence) ? this.state.choosePublishFrequence : ''),
      moreTypeIds: this.state.chooseMoreTypeIds
    })
  },

  // 表格
  /**
   * 列自定义点击事件
   * @param item 行数据
   */
  handleClick(item, event) {
    event = event ? event : window.event;
    event.stopPropagation();
    // console.log(item)
  },

  /**
   * 此回调方法是点击切换分页时触发，可以在此方法体内发送Ajax请求数据，来替代组件的url属性
   * @param page 当前页
   */
  onPageChange(page) {
    // 表格数据
    xhr({
      type: 'get',
      // url: `${URL.QUERY_SYNOPSIS_SROURCEQUERY}?currentPage=${page}&pageSize=10&orderType=${1}`,
      url: URL.QUERY_SYNOPSIS_SROURCEQUERY 
            + '?currentPage=' + page
            + '&pageSize=10'
            + '&searchWord=' + this.state.searchValue
            + '&sourceFrom=' + this.state.chooseSourceFrom
            + '&thridInfo=' + this.state.chooseThridInfo
            + '&product=' + this.state.chooseProduct
            + '&orderType=' + this.state.rankOrUpload
            + "&theme=" + (parseInt(this.state.chooseHotType) ? this.state.chooseHotType : '') 
            + "&from=" + this.state.chooseTime[0]
            + "&to=" + this.state.chooseTime[1]
            + "&language="  + (parseInt(this.state.chooseLanguage) ? this.state.chooseLanguage : '')
            + "&sourceType=" + (parseInt(this.state.chooseSourceType) ? this.state.chooseSourceType : '')
            + "&type=" + (parseInt(this.state.choosePublishFrequence) ? this.state.choosePublishFrequence : '')
            + "&moreTypeIds=" + this.state.chooseMoreTypeIds
      ,
      success: (result) => {
        this.setState({
          tableData: result
        })
      }
    })
  },

  handleCheckboxSelect(selectedRows) {
    // console.log('rows:', selectedRows)
  },

  handleRowClick(row) {

    //跳转到详情页
    
  },

  handleOrder(name, sort) {
    // console.log(name, sort)
  },

  // xhr 函数
  synopsisXhr(json) {
    // 表格数据
    xhr({
      type: 'get',
      url: URL.QUERY_SYNOPSIS_SROURCEQUERY + '?currentPage=1&pageSize=10'
            + '&searchWord=' + json.searchWord
            + '&sourceFrom=' + json.sourceFrom
            + '&newspaperMedia=' +  json.newspaperMedia
            + '&thridInfo=' + json.thridInfo
            + '&product=' + json.product
            + '&electronicJournal=' + json.electronicJournal
            + '&orderType=' + json.orderType
            + "&theme=" + json.theme
            + "&from=" + json.from
            + "&to=" + json.to
            + "&language="  + json.language
            + "&sourceType=" + json.sourceType
            + "&type=" + json.type
            + "&moreTypeIds=" + json.moreTypeIds
      ,
      success: (result) => {
        this.setState({
          tableData: result
        })
      }
    })
  },

  // tab 综合排序 
  rankClick() {
    this.setState({
      rankOrUpload: 1,
    })

    // 表格数据
    this.synopsisXhr({
      searchWord: this.state.searchValue,
      sourceFrom: (this.state.chooseSourceFrom),
      newspaperMedia: (this.state.chooseNewspaperMedia),
      thridInfo: (this.state.chooseThridInfo),
      product: (this.state.chooseProduct),
      electronicJournal: (this.state.chooseElectronicJournal),
      orderType: 1,
      theme: (parseInt(this.state.chooseHotType) ? this.state.chooseHotType : ''),
      from: this.state.chooseTime[0],
      to: this.state.chooseTime[1],
      language: (parseInt(this.state.chooseLanguage) ? this.state.chooseLanguage : ''),
      sourceType: (parseInt(this.state.chooseSourceType) ? this.state.chooseSourceType : ''),
      type: (parseInt(this.state.choosePublishFrequence) ? this.state.choosePublishFrequence : ''),
      moreTypeIds: this.state.chooseMoreTypeIds
    })
  },

  // tab 最新上传
  uploadClick() {
    this.setState({
      rankOrUpload: 2,
    })

    // 表格数据
    this.synopsisXhr({
      searchWord: this.state.searchValue,
      sourceFrom: (this.state.chooseSourceFrom),
      newspaperMedia: (this.state.chooseNewspaperMedia),
      thridInfo: (this.state.chooseThridInfo),
      product: (this.state.chooseProduct),
      electronicJournal: (this.state.chooseElectronicJournal),
      orderType: 2,
      theme: (parseInt(this.state.chooseHotType) ? this.state.chooseHotType : ''),
      from: this.state.chooseTime[0],
      to: this.state.chooseTime[1],
      language: (parseInt(this.state.chooseLanguage) ? this.state.chooseLanguage : ''),
      sourceType: (parseInt(this.state.chooseSourceType) ? this.state.chooseSourceType : ''),
      type: (parseInt(this.state.choosePublishFrequence) ? this.state.choosePublishFrequence : ''),
      moreTypeIds: this.state.chooseMoreTypeIds
    })
  },

  // 选择 资源类型
  sourceType(sourceTypeId) {
    this.setState({
      chooseSourceType: sourceTypeId
    })

    // 表格数据
    this.synopsisXhr({
      searchWord: this.state.searchValue,
      sourceFrom: (this.state.chooseSourceFrom),
      newspaperMedia: (this.state.chooseNewspaperMedia),
      thridInfo: (this.state.chooseThridInfo),
      product: (this.state.chooseProduct),
      electronicJournal: (this.state.chooseElectronicJournal),
      orderType: this.state.rankOrUpload,
      theme: (parseInt(this.state.chooseHotType) ? this.state.chooseHotType : ''),
      from: this.state.chooseTime[0],
      to: this.state.chooseTime[1],
      language: (parseInt(this.state.chooseLanguage) ? this.state.chooseLanguage : ''),
      sourceType: (parseInt(sourceTypeId) ? sourceTypeId : ''),
      type: (parseInt(this.state.choosePublishFrequence) ? this.state.choosePublishFrequence : ''),
      moreTypeIds: this.state.chooseMoreTypeIds
    })
  },

  // 选择 热门主题
  hotType(hotTypeId) {
    this.setState({
      chooseHotType: hotTypeId
    })

    // 表格数据
    this.synopsisXhr({
      searchWord: this.state.searchValue,
      sourceFrom: (this.state.chooseSourceFrom),
      newspaperMedia: (this.state.chooseNewspaperMedia),
      thridInfo: (this.state.chooseThridInfo),
      product: (this.state.chooseProduct),
      electronicJournal: (this.state.chooseElectronicJournal),
      orderType: this.state.rankOrUpload,
      theme: (parseInt(hotTypeId) ? hotTypeId : ''),
      from: this.state.chooseTime[0],
      to: this.state.chooseTime[1],
      language: (parseInt(this.state.chooseLanguage) ? this.state.chooseLanguage : ''),
      sourceType: (parseInt(this.state.chooseSourceType) ? this.state.chooseSourceType : ''),
      type: (parseInt(this.state.choosePublishFrequence) ? this.state.choosePublishFrequence : ''),
      moreTypeIds: this.state.chooseMoreTypeIds
    })
  },

  // 选择 刊发频次
  publishFrequence(publishId) {
    this.setState({
      choosePublishFrequence: publishId
    })

    // 表格数据
    this.synopsisXhr({
      searchWord: this.state.searchValue,
      sourceFrom: (this.state.chooseSourceFrom),
      newspaperMedia: (this.state.chooseNewspaperMedia),
      thridInfo: (this.state.chooseThridInfo),
      product: (this.state.chooseProduct),
      electronicJournal: (this.state.chooseElectronicJournal),
      orderType: this.state.rankOrUpload,
      theme: (parseInt(this.state.chooseHotType) ? this.state.chooseHotType : ''),
      from: this.state.chooseTime[0],
      to: this.state.chooseTime[1],
      language: (parseInt(this.state.chooseLanguage) ? this.state.chooseLanguage : ''),
      sourceType: (parseInt(this.state.chooseSourceType) ? this.state.chooseSourceType : ''),
      type: (parseInt(publishId) ? publishId : ''),
      moreTypeIds: this.state.chooseMoreTypeIds
    })
  },

  // 选择 语种
  languageType(languageId) {
    this.setState({
      chooseLanguage: languageId
    })

    // 表格数据
    this.synopsisXhr({
      searchWord: this.state.searchValue,
      sourceFrom: (this.state.chooseSourceFrom),
      newspaperMedia: (this.state.chooseNewspaperMedia),
      thridInfo: (this.state.chooseThridInfo),
      product: (this.state.chooseProduct),
      electronicJournal: (this.state.chooseElectronicJournal),
      orderType: this.state.rankOrUpload,
      theme: (parseInt(this.state.chooseHotType) ? this.state.chooseHotType : ''),
      from: this.state.chooseTime[0],
      to: this.state.chooseTime[1],
      language: (parseInt(languageId) ? languageId : ''),
      sourceType: (parseInt(this.state.chooseSourceType) ? this.state.chooseSourceType : ''),
      type: (parseInt(this.state.choosePublishFrequence) ? this.state.choosePublishFrequence : ''),
      moreTypeIds: this.state.chooseMoreTypeIds
    })
  },

  // 选择 日历
  dateOnChange(value, dateString) {
    this.setState({
      calendarTime: dateString[0] + '~' + dateString[1],
      chooseTime: [dateString[0], dateString[1]]
    })

    // 表格数据
    this.synopsisXhr({
      searchWord: this.state.searchValue,
      sourceFrom: (this.state.chooseSourceFrom),
      newspaperMedia: (this.state.chooseNewspaperMedia),
      thridInfo: (this.state.chooseThridInfo),
      product: (this.state.chooseProduct),
      electronicJournal: (this.state.chooseElectronicJournal),
      orderType: this.state.rankOrUpload,
      theme: (parseInt(this.state.chooseHotType) ? this.state.chooseHotType : ''),
      from: dateString[0],
      to: dateString[1],
      language: (parseInt(this.state.chooseLanguage) ? this.state.chooseLanguage : ''),
      sourceType: (parseInt(this.state.chooseSourceType) ? this.state.chooseSourceType : ''),
      type: (parseInt(this.state.choosePublishFrequence) ? this.state.choosePublishFrequence : ''),
      moreTypeIds: this.state.chooseMoreTypeIds
    })
  },

  calendarClick(ev) {
    ev.target.style.opacity = 1;
  },

  // search输入框

  inpClick(ev) {
    this.setState({
      searchValue: ev.target.value
    })
  },

  //模糊搜索
  searchClick(searchValue) {
    this.setState({
      searchValue: searchValue
    })

    // 表格数据
    this.synopsisXhr({
      searchWord: searchValue,
      sourceFrom: (this.state.chooseSourceFrom),
      newspaperMedia: (this.state.chooseNewspaperMedia),
      thridInfo: (this.state.chooseThridInfo),
      product: (this.state.chooseProduct),
      electronicJournal: (this.state.chooseElectronicJournal),
      orderType: this.state.rankOrUpload,
      theme: (parseInt(this.state.chooseHotType) ? this.state.chooseHotType : ''),
      from: this.state.chooseTime[0],
      to: this.state.chooseTime[1],
      language: (parseInt(this.state.chooseLanguage) ? this.state.chooseLanguage : ''),
      sourceType: (parseInt(this.state.chooseSourceType) ? this.state.chooseSourceType : ''),
      type: (parseInt(this.state.choosePublishFrequence) ? this.state.choosePublishFrequence : ''),
      moreTypeIds: this.state.chooseMoreTypeIds
    })
  },

  // 输入框focus
  handleFocus() {
    document.addEventListener('keydown', this.handleDocumentEnter, false)
  },

  handleBlur() {
    document.removeEventListener('keydown', this.handleDocumentEnter, false)
  },

  handleDocumentEnter(e) {
    if (e.keyCode == 13) {
      this.searchClick()
    }
  },

  //更多主题分类回调函数
  moreCallBack(str) {
    this.setState({
      chooseMoreTypeIds: str
    })
    xhr({
      type: 'get',
      url: URL.QUERY_SYNOPSIS_SROURCEQUERY + '?currentPage=1&pageSize=10'
            + '&searchWord=' + (this.state.searchValue)
            + '&sourceFrom=' + (this.state.chooseSourceFrom)
            + '&thridInfo=' + (this.state.chooseThridInfo)
            + '&product=' + (this.state.chooseProduct)
            + '&orderType=' + this.state.rankOrUpload
            + "&theme=" + (parseInt(this.state.chooseHotType) ? this.state.chooseHotType : '')
            + "&from=" + this.state.chooseTime[0]
            + "&to=" + this.state.chooseTime[1]
            + "&language="  + (parseInt(this.state.chooseLanguage) ? this.state.chooseLanguage : '')
            + "&sourceType=" + (parseInt(this.state.chooseSourceType) ? this.state.chooseSourceType : '')
            + "&type=" + (parseInt(this.state.choosePublishFrequence) ? this.state.choosePublishFrequence : '')
            + "&moreTypeIds=" + str
      ,
      success: (result) => {
        this.setState({
          tableData: result
        })
      }
    })
  },

  componentDidMount() {
    // 表格数据
    xhr({
      type: 'get',
      url: `${URL.QUERY_SYNOPSIS_SROURCEQUERY}?currentPage=1&pageSize=10&orderType=1&searchWord=${(this.state.searchValue)}`,
      success: (result) => {
        this.setState({
          tableData: result
        })
      }
    })

    //来源信息
    xhr({
      type: 'get',
      url: `${URL.QUERY_SYNOPSIS_SROURCEINFO}?type=6`,
      success: (result) => {
        let treeData = [{
          name: '中经社', 
          open: false, 
          isParent: true, 
          children: result
        }]
        this.setState({
          sourceInfoData: treeData,
          initialSourceInfoData: treeData
        })
      }
    })

    // 报刊媒体
    xhr({
      type: 'get',
      url: `${URL.QUERY_SYNOPSIS_SROURCEINFO}?type=15`,
      success: (result) => {
        let treeData = [{
          name: '报刊媒体', 
          open: false, 
          isParent: true, 
          children: result
        }]
        this.setState({
          newspaperMedia: treeData,
          initialNewspaperMedia: treeData
        })
      }
    })

    //第三方信息
    xhr({
      type: 'get',
      url: `${URL.QUERY_SYNOPSIS_SROURCEINFO}?type=10`,
      success: (result) => {
        let treeData = [{
          name: '第三方信息', 
          open: false, 
          isParent: true, 
          children: result
        }]
        this.setState({
          thirdInfoData: treeData,
          initialThirdInfoData: treeData
        })
      }
    })

    //主打产品
    xhr({
      type: 'get',
      url: `${URL.QUERY_SYNOPSIS_SROURCEINFO}?type=11`,
      success: (result) => {
        let treeData = [{
          name: '主打报告', 
          open: false, 
          isParent: true, 
          children: result
        }]
        this.setState({
          mainInfoData: treeData,
          initialMainInfoData: treeData
        })
      }
    })

    // 电子期刊
    xhr({
      type: 'get',
      url: `${URL.QUERY_SYNOPSIS_SROURCEINFO}?type=16`,
      success: (result) => {
        let treeData = [{
          name: '电子期刊', 
          open: false, 
          isParent: true, 
          children: result
        }]
        this.setState({
          electronicJournal: treeData,
          initialElectronicJournal: treeData
        })
      }
    })

    // 热门主题
    xhr({
      type: 'get',
      url: `${URL.QUERY_SYNOPSIS_SROURCEINFO}?type=12`,
      success: (result) => {
        this.setState({
          hotType: result
        })
      },
      error: () => {
        alert('交互错误')
      }
    })

    // 语种
    xhr({
      type: 'get',
      url: `${URL.QUERY_SYNOPSIS_SROURCEINFO}?type=5`,
      success: (result) => {
        this.setState({
          language: result
        })
      }
    })

    // 刊发频次
    xhr({
      type: 'get',
      url: `${URL.QUERY_SYNOPSIS_SROURCEINFO}?type=3`,
      success: (result) => {
        this.setState({
          publishFrequence: result
        })
      }
    })

    this.onFeedback()
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      searchValue: (nextProps.location.query.searchWord ? nextProps.location.query.searchWord : '')
    })
  },
  onFeedback(){
   /* jQuery.ajax({
      type:"GET",
      url:"http://192.168.110.54:8081/s/a442dce383111977844b6b8d508cc770-T/zh_CN-291390/6336/9/1.4.15/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs.js?locale=zh-CN&collectorId=787cd59a",
      cache:true,
      dataType:'script',
      timeout:3000,
    })*/

  //  $('#main-feedback').append('<script type="text/javascript" src="http://192.168.110.54:8081/s/a442dce383111977844b6b8d508cc770-T/zh_CN-291390/6336/9/1.4.15/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=zh-CN&collectorId=787cd59a"></script>');
  
  },
  render() {

    // 热门主题分类
    const hotType = this.state.hotType.map((item, i) => {
      return (
        <Option key={i} value={item.ref_id}>{item.name}</Option>
      )
    })

    // 语种
    const language = this.state.language.map((item, i) => {
      return (
        <Option key={i} value={item.id}>{item.name}</Option>
      )
    })

    // 刊发频次
    const publishFrequence = this.state.publishFrequence.map((item, i) => {
      return (
        <Option key={i} value={item.id}>{item.name}</Option>
      )
    })

    return (
      <div className="synopsis-box" id="main-feedback">
        {/**  <div className="synopsis-search">
            <input onFocus={this.handleFocus} onBlur={this.handleBlur} className="search-inp" value={this.state.searchValue} onChange={this.inpClick} type="text" placeholder="请输入要搜索的关键字" />
            <button onClick={this.searchClick} className="synopisis-search-btn">
              <i className="fa fa-search"></i>
              <span>搜索</span>
            </button>
          </div>
        */}
        <SearchBox handleCallback={this.searchClick} initialSearchValue={this.state.searchValue}></SearchBox>
        <div className="synopsis-con row">
          <div className="synopsis-left col-md-2">
            {/**<h3 className="synopsis-left-tit">来源分类</h3>*/}
            <div className="source-info">
              <Tree data={ this.state.sourceInfoData } onActive={this.sourceInfoActive} />
            </div>
            <div className="newspaper-media">
              <Tree data={ this.state.newspaperMedia } onActive={this.newspaperMediaActive} />
            </div>
            <div className="third-info">
              <Tree data={ this.state.thirdInfoData } onActive={this.thirdInfoActive} />
            </div>
            <div className="main-goods">
              <Tree data={ this.state.mainInfoData } onActive={this.mainInfoActive} />
            </div>
            <div className="electronic-journal">
              <Tree data={ this.state.electronicJournal } onActive={this.electronicJournalActive} />
            </div>
          </div>
          <div className="synopsis-right col-md-10">
            <div className="synopsis-right-con">
              <div className="article-condition clearfix">
                <div className="article-condition-con article-tab pull-left">
                  <button onClick={ this.rankClick } className={ this.state.rankOrUpload === 1 ? 'active' : '' }>综合排序</button>
                  <button onClick={ this.uploadClick } className={ this.state.rankOrUpload === 2 ? 'active' : '' }>最新上传</button>
                </div>
                <div className="article-condition-con article-condition-con2 pull-left clearfix">
                  <div className="pull-left condition-tips">资源类型</div>
                  <Select onChange={this.sourceType}>
                    <Option>全部</Option>
                    <Option value="2">报告</Option>
                    <Option value="1">动态资讯</Option>
                    <Option value="3">方案素材</Option>
                  </Select>
                </div>
                <div className="article-condition-con article-condition-con2 pull-left clearfix">
                  <div className="pull-left condition-tips">热门主题</div>
                  <Select className="pull-left" onChange={this.hotType}>
                    <Option>全部</Option>
                    {hotType}
                  </Select>
                </div>
                <div className="article-condition-con article-condition-con2 pull-left clearfix">
                  <div className="pull-left condition-tips">刊发频次</div>
                  <Select className="pull-left" onChange={this.publishFrequence}>
                    <Option>全部</Option>
                    {publishFrequence}
                  </Select>
                </div>
                <div className="article-condition-con article-condition-con2 article-condition-con3 pull-left clearfix">
                  <div className="pull-left condition-tips">语种</div>
                  <Select className="pull-left" onChange={this.languageType}>
                    <Option>全部</Option>
                    {language}
                  </Select>
                </div>
                <div className="article-condition-con article-condition-con4 article-condition-time pull-left clearfix">
                  {/**<div className="pull-left condition-tips"></div>*/}
                  <div onClick={ this.calendarClick } className="article-calendar">
                    <RangePicker style={{ width: 184 }} onChange={this.dateOnChange} />
                  </div>
                  {/**
                  <div className="article-condition-customTime clearfix pull-left">
                    <span className="pull-left">{ this.state.calendarTime }</span>
                    <i className="fa fa-calendar pull-right"></i>
                  </div>
                  */}
                </div>
                {/**
                <div className="article-condition-con article-condition-total pull-right clearfix">
                  <p className="pull-left">共找到<span>{this.state.tableData.totalPageNum}</span>条</p>
                  <p className="pull-left"><span className="total-page">{this.state.tableData.currentPage}</span>/<span>{Math.ceil(this.state.tableData.totalPageNum / 10)}</span></p>
                </div>
                */}
              </div>
              <div className="article-condition-more">
              {/**
                <MoreCondition callBack= {this.moreCallBack}></MoreCondition>
              */}
              </div>
              <div className="article-table">
                <DataTable 
                  data={this.state.tableData} 
                  onPageChange={this.onPageChange} 
                  showPage="true" 
                  column={this.state.column} 
                  howRow={10}
                  onRowClick={this.handleRowClick}
                  onOrder={this.handleOrder}
                  onCheckboxSelect={this.handleCheckboxSelect} >
                </DataTable>
                <ShareModal articleId={this.state.modalData.id} visible={this.state.modalData.visible} onCancleClick={this.handleShareModalCancel}></ShareModal>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}) 