import './index.less'
import React from 'react'
import { Dropdown, DropdownToggle, DropdownMenu } from 'bfd/Dropdown'
import Input from 'bfd/Input'
import Icon from 'bfd/Icon'
import { Checkbox } from 'bfd/Checkbox'
import xhr from 'public/xhr'
import URL from 'public/url'
import searchNode from './keys'
import TextOverflow from 'bfd/TextOverflow'
import emitter from '../../eventEmitter'
import classnames from 'classnames'

const MultipleTreeSelect = React.createClass({

		getInitialState() {
			return {
				data: [], //接口数据	 		
				items: [], //列表数据
				values: [] //所有被勾选的节点的集合数组	 				
			}
		},

		componentWillMount() {
			emitter.on("MultipleTreeSelectSend", () => {
				/**
				 *初始化数据，获取props里的value的数据，并设置默认值  
				 */
				const self = this
				const {
					value
				} = this.props

				if (!value) return

				xhr({
					type: 'GET',
					url: self.props.url,
					success(reponse) {
						self.setState({
							data: reponse
						})

						if (value && value.length > 0) {
							value.map((item, i) => {
								self.setDataIsChecked(item, true, 'code')
							})
						}
						//处理勾选的节点状态。
						self.handleChecksAll(self.state.data)
						//获取到所有被勾选的节点。
						const checksAllArr = self.getCheckedList(self.state.data)
						//整理节点数组数据。
						const result = self.handleValues(checksAllArr)
						//剔除父级节点
						const valuesData = self.ticDataParent(result)
						//set values
						self.setState({
							values: valuesData
						})
					}
				})
			})
		},

		/**
		 *初始化后台的接口数据，并保存到state的data数组中
		 */
		componentDidMount() {
			const self = this
			xhr({
				type: 'GET',
				url: self.props.url,
				success(reponse) {
					self.setState({
						data: reponse
					})
					//设置默认值。
					if (self.props.defaultValue) {
						const a = searchNode(self.props.defaultValue, self.state.data, 'id')
						a && a.length > 0 && a.map(function(item, i) {
							self.itemCheckedChange(item, {
								target: {
									checked: true
								}
							})
						})
					}
				}
			})
		},

		/*
		 *动态获取子节点的长度个数，保存到state的items数组中，并渲染出ul的个数。
		 **/
		setItems(item, index) {
			let i = 0
			if (index) i = index
			let number = searchNode(item.id, this.state.data, 'id')
			let arr = this.state.items
			if (item.children.length > 0) arr[number.length - 1] = item
			this.setState({
				items: arr.splice(0, number.length - i)
			})
		},

		/*
		 *设置一个节点下的所有的checkBox是否全选，全不选。
		 **/
		setChildrenCheck(item, flag) {

			const self = this
			self.setDataIsChecked(item.id, flag)
			if (item.children && item.children.length > 0) {
				item.children.map(function(_item, _i) {
					self.setChildrenCheck(_item, flag)
				})
			}
		},

		//判断一个节点下的所有子节点是否是全选。
		isCheckAll(array) {

			let flag = true
			function tt(array) {
				array.map(function(item, i) {
					if (!item.checked) flag = false
					if (item.children && item.children.length > 0) {
						tt(item.children)
					}
				})
			}
			tt(array)
			return flag
		},

		//处理子节点全选时，只勾选父节点函数。
		handleChecksAll(data) {
			const self = this
			function tt(data) {
				data && data.length > 0 && data.map(function(item, i) {
					if(item.children && item.children.length>0){						
						if(self.isCheckAll(item.children)){
							self.setChildrenCheck(item,false)
							self.setDataIsChecked(item.id, true)
							self.setItems(item,1)	
						}						
						tt(item.children)
					}
				})
			}
			tt(data)
		},

		getCheckedList(data) {

			let a = []
			function bb(data) {
				data.map((item, i) => {
					if (item.checked) a.push(item)
					if (item.children && item.children.length > 0) {
						bb(item.children)
					}
				})
			}
			bb(data)
			return a
		},

		/*
		 *节点的点击事件处理函数
		 **/
		itemCheckedChange(item, { target }) {

			const self = this

			if (!target.checked && item.children && item.children.length > 0) {
				self.setChildrenCheck(item, false)
			} else {
				if (target.checked) {
					const a = searchNode(item.id, self.state.data, 'id')					
					a && a.length > 0 && a.map(function(_item, _i) {
						self.setDataIsChecked(_item.id, true)
					})

				} else {
					self.setDataIsChecked(item.id, false)
				}
			}

			//处理勾选的节点状态。
			self.handleChecksAll(self.state.data)			
			
			//获取到所有被勾选的节点。
			const checksAllArr = self.getCheckedList(self.state.data)

			
			//整理节点数组数据。
			const result = self.handleValues(checksAllArr)

			//剔除父级节点
			const valuesData = self.ticDataParent(result)

			//set values
			self.setState({
				values: valuesData
			})

			//将所选节点的code传递给父组件
			self.sendValuesCode(valuesData)

		},

		//删除一个item标签。
		removeItem(item) {

			this.itemCheckedChange(item, {
				target: {
					checked: false
				}
			})
			this.setItems(item)
		},

		//处理values数组数据，并传递给父组件。
		sendValuesCode(data) {

			const self = this
			let a = []
			data && data.length > 0 && data.map(function(item, i) {
				const m = searchNode(item.id, self.state.data, 'id')
				m && m.length > 0 && m.map(function(_item, _i) {
					a.push(_item.code)
				})
			})

			function tt(data) {
				if (data && data.length > 0) {
					data.map(function(item, i) {
						a.push(item.code)
						tt(item.children)
					})
				}
			}
			tt(data)
			this.props.onChange(self.unique(a))
		},

		//去除父节点函数。
		ticDataParent(_array) {

			let array = _array
			let a = []

			array.map(function(item, i) {
				for (let j = 0; j < array.length; j++) {
					if (i == j) continue
					if (array[j].name.indexOf(item.name) != -1) a.push(item)
				}
			})

			const result = this.removeArrayFromOther(array, a)
			return result
		},

		//删除数组函数。
		removeArrayFromOther(a, b) {

			let array = a,
				result = []

			if (b && b.length > 0) {
				b.map((item, i) => {
					array[array.indexOf(item)] = null
				})
			}

			array.map(function(item, i) {
				if (item) result.push(item)
			})

			return result
		},

		//处理values函数
		handleValues(data) {

			let result = []

			data.map((item, i) => {
				const a = searchNode(item.id, this.state.data, 'id')
				let b = []
				a.map((_item, _i) => {
					b.push(_item.name)
				})

				let o = {}
				o.id = item.id
				o.code = item.code
				o.children = item.children
				o.name = b.join(' > ')

				result.push(o)
			})
			return result
		},

		rightIconClick(item) {
			this.setItems(item)
		},

		//通过name设置一个节点的选中状态、配合searchItemById函数一起使用。
		setDataIsChecked(id, flag,name) {
			let data = this.state.data
			this.searchItemById(id, data, flag,name)
			this.setState({
				data
			})
		},

		//通过id设置一个数组中某个节点是否被选中的状态。
		searchItemById(id, array, flag,name) {
			array.map((item, i) => {
				if (item[name||'id'] == id) {
					item.checked = flag
				} else if (item.children && item.children.length > 0) {
					this.searchItemById(id, item.children, flag)
				}
			})
		},

		//判断数组中是否存在obj这个对象（粗略判断）
		isInArray(obj, array) {

			let flag = false
			array.map((item, i) => {
				if (item.id == obj.id) flag = true
			})
			return flag
		},

		handleArray(array, key) {

			let arr = []
			array.map((item, i) => {
				arr.push(item[key])
			})
			return arr
		},

		unique(arr) {

			let result = [],
				hash = {};
			for (let i = 0, elem;
				(elem = arr[i]) != null; i++) {
				if (!hash[elem]) {
					result.push(elem)
					hash[elem] = true
				}
			}
			return result;
		},

	render() { 
		const { ...other } = this.props
		return (
	      <div className="multiple-tree-select" { ...other }>
	      	<Dropdown>
	      		<Input value={this.state.values && this.state.values.length>0 && this.state.values.map((item,i)=>{
								let arr =[]
								arr.push(item.name)
								return arr
							}).join(';')||''} />
		        <DropdownToggle>
		          <Icon type="search" className="search-icon"/>
		        </DropdownToggle>
		        <DropdownMenu>
			        <div>
			        	<ul className="selected-list">
			        		{
			        		this.state.values && this.state.values.length>0 && this.state.values.map((item,i)=>{
			        				return (
			        					<li key={i}>{item.name} <span className="remove" onClick={this.removeItem.bind(this,item)}>x</span></li>			        		
			        				)
			        			})
			        		}		        		
			        	</ul>
			        </div>
			        <div className="table-responsive">
			          <div className="poc-jl-menu root-menu check-list">
				          <ul style={{overflow:'auto', paddingTop: '10px'}}>
			          	  { 
			          		this.state.data.map((item,i)=>{
			          			return (
			          			  	<li key={item.id} className="poc-jl-menu-item">
	          							{item.children && item.children.length>0 ?
	          							 	<div className="check-link">
										      	<a> 
										          <Checkbox style={{ position:'relative', top: '-6px'}}  checked={item.checked} onChange={this.itemCheckedChange.bind(this,item)} ></Checkbox>
										          <TextOverflow>
										          <p onClick={this.rightIconClick.bind(this,item)} className="multiple-tree-select-tit">{item.name}</p>
										          </TextOverflow>
										          <Icon type="angle-right" />
										        </a>
										    </div> :
										    <div className="check-link">
		          								<a> 
										          <Checkbox style={{ position:'relative', top: '-6px'}}  checked={item.checked} onChange={this.itemCheckedChange.bind(this,item)} ></Checkbox>
										          <TextOverflow>
										          <p className="multiple-tree-select-tit">{item.name}</p>
										          </TextOverflow>										         
										        </a>
									         </div>
	          							}			          										          								
          						  	</li>
			          			)
			          		})
			          	  }
				          </ul>
			          </div>
			          {
			          	this.state.items.map((item,i)=>{			          					          		 
			          		return (
			          			<div className="poc-jl-menu check-list" key={i}>
				          			<ul style={{overflow:'auto', paddingTop: '10px'}} >	
			          				{ 
			          					this.state.items[i] && this.state.items[i].children && this.state.items[i].children.map((_item,_i)=>{
			          						return(
			          							<li key={_item.id} className="poc-jl-menu-item">
				          							{_item.children && _item.children.length>0 ?
				          							 	<div className="check-link">
													      	<a> 
													          <Checkbox style={{ position:'relative', top: '-6px'}}  checked={_item.checked} onChange={this.itemCheckedChange.bind(this,_item)} ></Checkbox>
													          <TextOverflow>
													          <p className="multiple-tree-select-tit" onClick={this.rightIconClick.bind(this,_item)}>{_item.name}</p>
													          </TextOverflow>
													          <Icon type="angle-right" />
													        </a>
													    </div> :
													    <div className="check-link">
													      	<a> 
													          <Checkbox style={{ position:'relative', top: '-6px'}}  checked={_item.checked} onChange={this.itemCheckedChange.bind(this,_item)} ></Checkbox>
													          <TextOverflow>
													          <p className="multiple-tree-select-tit">{_item.name}</p>
													          </TextOverflow>												          
													        </a>
													    </div>			          								
				          							}			          										          								
			          							</li>
			          						)
			          					})
			          				}				          		
						          	</ul>
					          	</div>
			          		)
			          	})
			          }			         
			        </div>
		        </DropdownMenu>
	      	</Dropdown>
	      </div>
	    )
	}
})

export { MultipleTreeSelect , searchNode } 