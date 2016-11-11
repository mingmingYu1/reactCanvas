import React from 'react'
import { Link } from 'react-router'
import Button from 'bfd-ui/lib/Button'
import ReactDOM from 'react-dom'
import Icon from 'bfd-ui/lib/Icon'
import { Modal, ModalBody,ModalHeader } from 'bfd-ui/lib/Modal'
import { Row, Col } from 'bfd-ui/lib/Layout'
import xhr from 'bfd-ui/lib/xhr'
import formatTool from "public/formatTool.js"
import './index.less'

export default React.createClass({
  formData:{orgId:'1',
    name:"bfd",
    desc:"佰分点有限公司",
    domain:"www.baifendian.com",
    owner:"jingwei.cao",
    createTime:"2016/7/13 14:36:18",
    modifiedTime:"2016/7/13 14:36:18"
  },
  getInitialState() {
    return {
      data:{}
    }
  },
  componentDidMount(){
    formatTool.fillValues("informationPanel",this.formData)
  } ,
  handleInputChange(e){
    const input = e.target;
    this.formData[input.name] = input.value;
  },
  handleOut(){

  },
  handleEdit(){
    $(".informationPanel").find("input").removeAttr("readonly")
    $("#addOrg").removeClass("hidden");
  },
  handleSave(){
    $(".informationPanel").find("input").attr("readonly",true)
    $("#addOrg").addClass("hidden");
    console.log(this.formData)
  },
  handleDel(){

  },
  render() {
    return (
        <div className="main-box">
          <div className="Container orgbox">
            <div>
              <h2>新建组织</h2>
              <h5>创建我的组织完善信息</h5>
            </div>
            <div className="public-Prompt">
              <Icon type="exclamation-circle" className="TipsBtn"></Icon>
              <div className="TipsText">
                <h3>温馨提示：</h3>
                <p>您还没有加入任何组织，您可以点击这里<a href="/OrgManager/MyOrg/BuildOrg" title="创建组织">创建组织</a>，或点击这里<a  href="/OrgManager/JoinOrg" title="加入组织">加入组织</a></p>
              </div>
            </div>
            <div className= "informationPanel" id="informationPanel">
              <div className="panel-body listRow">
                <div className ="panel-tools">
                  <div className="panel-title">组织属性</div>
                  <div className="pull-right">
                    <Button icon="edit" transparent onClick={this.handleEdit} >修改属性</Button>
                    <Button icon="sign-out" transparent  onClick={this.handleOut} >退出组织</Button>
                    <Button icon="times" transparent onClick={this.handleDel} >注销组织</Button>
                  </div>
                </div>

                <Row gutter>
                  <Col col="sm-3"> 组织代号 </Col>
                  <Col col="sm-8"><input type="text" className="form-control" name="name" readOnly  onChange={this.handleInputChange} /> </Col>
                </Row>
                <Row gutter>
                  <Col col="sm-3"> 组织名称 </Col>
                  <Col col="sm-8"> <input type="text" className="form-control"  name="desc" readOnly  onChange={this.handleInputChange} /> </Col>
                </Row>
                <Row gutter>
                  <Col col="sm-3"> 组织域名 </Col>
                  <Col col="sm-8"><input type="text" className="form-control"  name="domain" readOnly  onChange={this.handleInputChange} /> </Col>
                </Row>
                <Row gutter>
                  <Col col="sm-3"> Ownel </Col>
                  <Col col="sm-8"> <input type="text" className="form-control"  name="owner" readOnly  onChange={this.handleInputChange}/> </Col>
                </Row>
                <Row gutter>
                  <Col col="sm-3">组织注册时间 </Col>
                  <Col col="sm-8"><span className="fromText" name ="createTime"></span></Col>
                </Row>
                <Row gutter>
                  <Col col="sm-3"> 加入组织时间 </Col>
                  <Col col="sm-8"><span className="fromText" name="modifiedTime"></span></Col>
                </Row>
                <Row gutter>
                  <Col col="sm-3"> </Col>
                  <Col col="sm-8">
                    <Button icon="save" id="addOrg" className="hidden" onClick={this.handleSave} >保存</Button>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
    )
  }
})
