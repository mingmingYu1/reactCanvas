import './index.less'
import React from 'react'
import URL from 'public/url'
import Button from 'bfd/Button'
import message from 'bfd/message'
import Upload from 'bfd/Upload'
import xhr from 'bfd/xhr'
import auth from 'public/auth'

export default React.createClass({
  getInitialState(){
    return {
      "id":auth.user.id,
      "priviewVisible":false,
      "priviewImage":'',
      "personalInfo":{
        "headPic":auth.user.headPic,
        "desc":auth.user.desc,
      },
      "isShowUpBtn":"show-btn",
    }
  },
  onSave(){
    /*if(this.state.personalInfo.headPic == "" && this.refs.desc.value == ""){
      message.danger("您未填写任何信息，请编辑后保存！",3000);
      return;
    }*/
    xhr({
      type:"POST",
      url:URL.QUERY_PERSONAL_UPDATEINFO,
      data:{"id":this.state.id,
            "headPic":this.state.personalInfo.headPic,
            "desc":this.refs.desc.value
      },
      success:(res) =>{
        message.success('个人信息保存成功！')
        this.props.onInfoSaved(this.state.personalInfo.headPic)
        auth.user.headPic = this.state.personalInfo.headPic,
        auth.user.desc = this.refs.desc.value;
        auth.register(auth.user)
      }
    })
  },
  onUploadClick(){
    const file = this.refs.file;
    file.click();
  },
  handleImg({target}){
    let file = target.files[0]  //src = window.URL.createObjectURL(f);
    let reader = new FileReader();
    let _this = this
    reader.readAsDataURL(file);
    reader.onload = function(e){
      var personalInfo = {
        "headPic":e.target.result,
        "desc":_this.state.personalInfo.desc,
      }
      _this.setState({personalInfo:personalInfo})
    }
  },
  handleMouseEnter(){
    this.setState({isShowUpBtn:"show-btn"})
  },
  handleMouseLeave(){
    this.setState({isShowUpBtn:""})
  },
  componentDidMount(){
    /*xhr({
      type:"GET",
      url:URL.QUERY_PERSONAL_PERSONALINFO +"?id="+this.state.id,
      success:(res) => {
        res && this.setState({personalInfo:res})

      }
    })*/
  },
  render(){
    return (
        <div className="personal-info">
          <div className="col-md-12 info">
            <div className="col-md-12 info-item"><h5>个人信息</h5></div>
            <dl className="col-md-12 info-item">
                <dd className="photo" onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
                  <img src={this.state.personalInfo.headPic !== "" && this.state.personalInfo.headPic ||  require('../images/portrait.png')} alt="个人头像" />
                  <span className="uploadPhoto">
                    <input type="file" onChange={this.handleImg} ref="file"/>
                    <div className={"upload-btn "+this.state.isShowUpBtn} onClick={this.onUploadClick}>修改头像</div> 
                  </span>  
                </dd>       
            </dl>
            <dl className="col-md-12 info-item">
              <dt><h5>个人简介</h5></dt>
              <dd>
                <textarea placeholder="请输入描述" ref="desc" defaultValue={this.state.personalInfo.desc} ></textarea>
              </dd>
            </dl>
            <dl>
              <dt></dt>
              <dd>
                <div className="col-md-12 info-item"><Button className="btn-save" type="primary" onClick={this.onSave}>保存</Button></div>
              </dd>
            </dl>      
          </div>
        </div>
      )
  }
})