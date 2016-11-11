import React from 'react'
import { Link } from 'react-router'
import Button from 'bfd-ui/lib/Button'
import ReactDOM from 'react-dom'
import Icon from 'bfd-ui/lib/Icon'
import { Modal, ModalBody,ModalHeader } from 'bfd-ui/lib/Modal'
import { Row, Col } from 'bfd-ui/lib/Layout'
import xhr from 'bfd-ui/lib/xhr'
import { Form, FormItem } from 'bfd-ui/lib/Form'
import { Select, Option } from 'bfd-ui/lib/Select'
import FormTextarea from 'bfd-ui/lib/FormTextarea'
import confirm from 'bfd-ui/lib/confirm'
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
    confirm('确认退出该组织？', () => {
      console.log(1)
    })
  },
  handleOver(){
    this.refs.attorn.open();
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
    confirm('确认删除该组织？', () => {
      console.log(1)
    })
  },
  render() {
    let Children = this.props.children
    if (!Children){
      Children = <div className="main-box">
        <div className="Container orgbox">
          <div>
            <h2>我的组织</h2>
            <h5>查看,管理我的组织信息</h5>
          </div>
          <div className="public-Prompt">
            <Icon type="exclamation" className="TipsBtn"></Icon>
            <div className="TipsText">
              <h3>温馨提示：</h3>
              <p>您还没有加入任何组织，您可以点击这里<a href="/OrgManager/MyOrg/BuildOrg" title="创建组织">创建组织</a>，或点击这里<a  href="/OrgManager/MyOrg/JoinOrg" title="加入组织">加入组织</a></p>
            </div>
          </div>
          <div className= "informationPanel" id="informationPanel">
            <div className="panel-body listRow">
              <div className ="panel-tools">
                <div className="panel-title">组织属性</div>
                <div className="pull-right">
                  <Button icon="edit" transparent onClick={this.handleEdit} >修改属性</Button>
                  <Button icon="share" transparent  onClick={this.handleOver} >转让组织</Button>
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
        <Modal ref="attorn" lock>
          <ModalHeader >
            <h4 className="modal-title">转让组织</h4>
          </ModalHeader>
          <ModalBody>
            <Form
                ref="form"
                action="form"
                data={this.formData}
                rules={this.rules}
                onSuccess={this.handleSuccess}
                >
              <FormItem label="接收人" required name="name">
                <Select searchable style={{width:'200px'}}>
                  <Option>请选择</Option>
                  <Option value="0">张三</Option>
                  <Option value="1">李四</Option>
                  <Option value="2">王二</Option>
                </Select>
              </FormItem>
              <FormItem label="转让理由" required name="reason" help="500个字符以内">
                <FormTextarea   style={{resize:"none",height:"200px"}}></FormTextarea>
              </FormItem>

              <button type="button" style={{marginLeft: '100px'}} className="btn btn-primary">确定</button>
              <button type="button" style={{marginLeft: '20px'}} className="btn" >取消</button>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    }

    return (
        <div>
        {Children}
        </div>
    )
  }
})
