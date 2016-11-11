import React from 'react'
import classnames from 'classnames'
import xhr from 'public/xhr'
import './index.less'

export default React.createClass({

	getInitialState() {
		return {
			moreConditionShow: false,
			allData: [],
			centerAllData: [],
			rightAllData: [],
      oldAllData: [],
      oldCenterAllData: [],
      oldRightAllData: [],
			leftChoose: [],
			centerChoose: [],
			rightChoose: [],
			leftClick: {},
			centerClick: {},
		}
	},

	handleChange(selects) {
    // console.log(selects)
  },

  moreConditionClick(ev) {
  	ev.preventDefault()
  	ev.stopPropagation()
  	this.setState({
  		moreConditionShow: !this.state.moreConditionShow
  	})
  },

  eventBind(obj, sEv, fn) {
  	return (obj.addEventListener ? obj.addEventListener(sEv, fn, false) : obj.attachEvent('on' + sEv, fn))
  },

  checkMainClick(ev) {
  	ev.stopPropagation()
  },

  // 检查数组是否含有某一对象
  arrCheck(arr, myItem) {
			for ( let x = 0; x < arr.length; x++) {
  			if (arr[x].id === myItem.id) {
  				return true
  			}
  		}
  		return false
  },

  //检查某一对象在数组中的下标
  arrConain(arr, myItem) {
  	for ( let x = 0; x < arr.length; x++) {
			if (arr[x].id === myItem.id) {
				return x
			} 
		}
  },

	// 第一层级复选事件
  checkClickOne(item, i) {
  	let conditionData = this.state.allData
  	conditionData[i].checked = !conditionData[i].checked
  	this.setState({
  		allData: conditionData
  	})

  // 	let leftChoose = this.state.leftChoose
  // 	// 选中状态
  // 	if (conditionData[i].checked) {
		// 	if (!this.arrCheck(leftChoose, item)) {
		// 		leftChoose.push(item)
		// 	}

		// // 取消选中状态
  // 	} else {
  // 		// 数组删除取消的对象
  // 		leftChoose.splice(this.arrConain(leftChoose, item), 1)
  // 	}
  // 	this.setState({
  // 		leftChoose: leftChoose
  // 	})
  },

  // 第一层级点击事件
  titClickOne(item, i) {
  	let titData = this.state.allData
  	for (let j = 0; j < titData.length; j++) {
  		if (titData[j].active) {
  			titData[j].active = false
  		}
  	}
  	titData[i].active = true

  	// 第二层级数据
  	this.setState({
  		allData: titData,
  		centerAllData: titData[i].children,
  		rightAllData: []
  	})
  },

  // 第二层级复选事件
  checkClickTwo(item, i) {
  	let conditionData = this.state.centerAllData
  	conditionData[i].checked = !conditionData[i].checked
  	this.setState({
  		centerAllData: conditionData
  	})

  // 	let centerChoose = this.state.centerChoose
  // 	// 选中状态
  // 	if (conditionData[i].checked) {
		// 	if (!this.arrCheck(centerChoose, item)) {
		// 		centerChoose.push(item)
		// 	}

		// // 取消选中状态
  // 	} else {
  // 		// 数组删除取消的对象
  // 		centerChoose.splice(this.arrConain(centerChoose, item), 1)
  // 	}
  // 	this.setState({
  // 		centerChoose: centerChoose
  // 	})
  },

  // 第二层级点击事件
  titClickTwo(item, i) {
  	let titData = this.state.centerAllData
  	for (let j = 0; j < titData.length; j++) {
  		if (titData[j].active) {
  			titData[j].active = false
  		}
  	}
  	titData[i].active = true

  	// 第二层级数据
  	this.setState({
  		centerAllData: titData,
  		rightAllData: titData[i].children
  	})
  },

  // 第三层级复选事件
  checkClickThree(item, i) {
		let conditionData = this.state.rightAllData
  	conditionData[i].checked = !conditionData[i].checked
  	this.setState({
  		rightAllData: conditionData
  	})

  // 	let rightChoose = this.state.rightChoose
  // 	// 选中状态
  // 	if (conditionData[i].checked) {
		// 	if (!this.arrCheck(rightChoose, item)) {
		// 		rightChoose.push(item)
		// 	}

		// // 取消选中状态
  // 	} else {
  // 		// 数组删除取消的对象
  // 		rightChoose.splice(this.arrConain(rightChoose, item), 1)
  // 	}
  // 	this.setState({
  // 		rightChoose: rightChoose
  // 	})
  },

  // 确认
  makeSure() {
    //拼接多选选项
    // let chooseStr = ''
    // let chooseFn = (data) => {
    //   for (let i = 0; i < data.length; i++) {
    //     if (data[i].checked) {
    //       chooseStr +=  data[i].id + ','
    //     } 
    //     if (data[i].children) {
    //       chooseFn(data[i].children)
    //     } 
    //   }
    //   return chooseStr
    // }
    // let finishStr = chooseFn(this.state.allData)
    // this.props.callBack(finishStr)
    // this.setState({
    //   moreConditionShow: false
    // })

    let chooseObj = {}
    let chooseStr = ''
    let chooseFn2 = (data, obj) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].checked) {
          obj[data[i].id] =  {}
          if (data[i].children) {
            chooseFn2(data[i].children, obj[data[i].id])
          } 
        } 
        
      }
      return obj
    }

    //获取对象长度
    let getObjLength = (obj) => {
      let objLeng = 0
      for (let name in obj) {
        objLeng ++
      }
      return objLeng
    }
    let chooseAllObj = chooseFn2(this.state.allData, chooseObj)

    //选择的选项拼接
    let getStr = (obj) => {
      for (let name in obj) {
        if (getObjLength(obj[name])) {
          getStr(obj[name])
        } else {
          chooseStr += name + ','
        }
      }
    }
    getStr(chooseAllObj)
    
    this.props.callBack(chooseStr)
    this.setState({
      moreConditionShow: false
    })
  },

  makeReset() {
    let myState = this.state
    this.setState({
      allData: myState.oldAllData,
      centerAllData: myState.oldCenterAllData,
      rightAllData: myState.oldRightAllData
    })
  },

  componentDidMount() {

  	// 隐藏显示
  	// this.eventBind(window, 'click', () => {
  	// 	this.setState({
	  // 		moreConditionShow: false
	  // 	})
  	// })

  	// 更多主题分类
    let myState = this.state
    xhr({
      type: 'get',
      url: 'category/getCategoryList?type=13',
      success: (result) => {

        // 解决对象深度拷贝问题
        let result2 = JSON.parse(JSON.stringify(result))
        let result3 = (result2.children && result2.children.length) ? JSON.parse(JSON.stringify(result2.children[0])) : []
        let result4 = (result3.children && result3.children.length) ? JSON.parse(JSON.stringify(result3.children[0])) : []
        this.setState({
          allData: result,
          centerAllData: result[0].children,
          // rightAllData: result[0].children[0].children
          rightAllData: [],
          oldAllData: result2,
          oldCenterAllData: result3,
          oldRightAllData: result4
        })
      }
    })
  },

	render() {

		const conLeft = this.state.allData.map((item, i) => {
			return (
				<div className={"clearfix left-con " + (item.active ? "active" : "")} key={i}>
					<i onClick={this.checkClickOne.bind(this, item, i)} className={"fa pull-left " + (item.checked ? "fa-check-square-o fa-active" : "fa-square-o")}></i>
					<div onClick={ this.titClickOne.bind(this, item, i) } className="pull-left clearfix left-con-tit">
						<span className="pull-left rightTit">{ item.name }</span>
						<i className="fa fa-angle-right pull-right"></i>
					</div>
				</div>
			)
		})

		const conCenter = this.state.centerAllData.map((item, i) => {
			return (
				<div className={"clearfix left-con " + (item.active ? "active" : "")} key={i}>
					<i onClick={this.checkClickTwo.bind(this, item, i)} className={"fa pull-left " + (item.checked ? "fa-check-square-o fa-active" : "fa-square-o")}></i>
					<div onClick={ this.titClickTwo.bind(this, item, i) } className="pull-left clearfix left-con-tit">
						<span className="pull-left centerTit">{item.name}</span>
						<i className="fa fa-angle-right pull-right"></i>
					</div>
				</div>
			)
		})

		const conRight = this.state.rightAllData.map((item, i) => {
			return (
				<div className="right-checkbox pull-left clearfix" key={i}>
					<i onClick={this.checkClickThree.bind(this, item, i)} className={"fa pull-left " + (item.checked ? "fa-check-square-o fa-active" : "fa-square-o")}></i>
					<span className="pull-left">{item.name}</span>
				</div>
			)
		})

		return (
			<div className="more-condition">
				<div className={ "more-condition-tit clearfix " + ( this.state.moreConditionShow ? 'condition-tit-active' : '' ) } onClick={ this.moreConditionClick }>
					<span className="pull-left">更多主题分类</span>
					<i className="fa fa-angle-down pull-right"></i>
				</div>
				<div className={ 'more-condition-main ' + ( this.state.moreConditionShow ? 'condition-main-active' : '' ) } onClick={ this.checkMainClick }>
					<div className="row main-con">
            <div className="col-md-4 condition-main-left">
              { conLeft }
            </div>
            <div className="col-md-3 condition-main-left condition-main-middle">
             { conCenter }
            </div>
            <div className="col-md-5 condition-main-right clearfix">
              { conRight }
            </div>
          </div>
          <div className="main-bottom clearfix">
            <input onClick={this.makeReset} className="pull-right" type="button" value="重置" />
            <input onClick={this.makeSure} className="pull-right" type="button" value="确认" />
          </div>
				</div>
			</div>
		)
	}
})