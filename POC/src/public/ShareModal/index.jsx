import './index.less'
import React from 'react'
import URL from 'public/url'
import { Modal } from 'antd'
import Button from 'bfd/Button'
import xhr from 'bfd/xhr'
import {Select, Option} from 'bfd/Select'
import Fetch from 'bfd/Fetch'
import message from 'bfd/message'

const ShareModal = React.createClass({
  getInitialState(){
    return {
      "url":{
        "QUERY_DEPT_ALL":URL.QUERY_DEPT_ALL,
        "QUERY_USER_BYDEPT":URL.QUERY_USER_BYDEPT,
        "URL_SHARE":URL.URL_DETAILS_SHARE,
      },
      "id":this.props.articleId,
      "departments":[],
      "staffs":[],
      "deptId":"0",
      "staffId":"0",
      "visible":false,
      "defaultStaff":"0",
    }
  },
  onChangeDeparment(value){
    let val = Number(value.slice(1,-1))
    this.setState({deptId:val,staffs:[],staffId:"0"})
  },
  onChangeStaff(value){
    this.setState({staffId:value})
  },
  onShare(){
    if(this.state.staffId == 0){
      message.success("请选择姓名！")
      return;
    }
    xhr({
      type:"GET",
      url:this.state.url.URL_SHARE+'?id='+this.state.id+"&toUserIds="+parseInt(this.state.staffId.slice(1,-1)),
      success:(res) =>{
        if(res.message && res.message === "不能重复分享"){
          message.success("不能重复分享！")
        }else{
          message.success("分享成功！")
          this.props.onCancleClick()
        }       
      },
    })
  },
  componentDidMount(){
    xhr({
      type:"GET",
      url:this.state.url.QUERY_DEPT_ALL,
      success:(res) =>{
        this.setState({departments:res,deptId:res[0].id})
      }
    })
  },
  componentWillReceiveProps(nextProps) {
    this.setState({
      id: nextProps.articleId
    })
  },
  render(){
    const DepartmentOptions = this.state.departments.map((item, i) => {
      return (
              <Option key={i} value={'"'+item.id+'"'} defaultValue={i == 0 ? "true":"false"}>{item.name}</Option>
          )
    });
    const StaffOptions =this.state.staffs.length>0 && this.state.staffs.map((item, i) => {
        return (
            <Option key={i} value={'"'+item.id+'"'} selected={i == 0 ? "selected":""}>{item.name}</Option>
          )
      });  
    return (
        <div className="share-article">
        <Modal  title="分享" visible={this.props.visible} onCancel={this.props.onCancleClick}  onOk={this.onShare}>
          <div className="modal-share">
            <dl>
              <dt>部门：</dt>
              <dd>
                <Select defaultValue={'"'+this.state.deptId+'"'} onChange={this.onChangeDeparment} searchable>
                  {DepartmentOptions}
                </Select>
              </dd>
            </dl>
            <dl>
              <dt>姓名：</dt>
              <dd>
                <Select defaultValue="0" onChange={this.onChangeStaff} className={this.state.require} value={this.state.staffId} searchable>
                  <Option value="0" selected>--请选择姓名--</Option>
                  {StaffOptions}
                </Select>
                <Fetch url={this.state.url.QUERY_USER_BYDEPT+'?deptId='+this.state.deptId}  onSuccess={res => {this.setState({staffs:res})}} >
                </Fetch>
              </dd>
            </dl>
            {/*<dl>
              <p>
                <Button type="primary" onClick={this.onShare}>分享</Button>
                <Button type="minor" onClick={this.props.onCancleClick}>取消</Button>
              </p>
            </dl>*/}
          </div>
          <div></div>
        </Modal>
        </div>
      )
  }
})

export default ShareModal