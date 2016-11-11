import React from 'react'
import './index.less'
import { Link } from 'react-router'
import TextOverflow from 'bfd/TextOverflow'

const CardList = React.createClass({
  handleRowClick(id){
   // this.props.history.pushState(null,'/data/details',{id:id});
    window.open("/data/details?id="+id)
  },
  render() {
  	const { title, options ,icon} = this.props
  	let list
	if (options && options.length > 0) {
  		list = options.map((item,i)=>{         
	        return (
	        	<li key={i} onClick={this.handleRowClick.bind(this, item.id)}>
              <Link to="/data/details" query={{id:item.id}} target="_blank">
	            	<TextOverflow>
                  <span className="application-main-bottom-title">{item.title}</span>
                </TextOverflow>
	            	<span className="date">{item.date}</span>
              </Link>
	          </li>
	        )
	    })
  	}    
    return (
	    <div className="poc-card-list">
		    <div className="panel-card">
		        <h4 className="header"><i className={icon}></i>{title}</h4>                   
		        <ul className="application-main-bottom-list">{list}
              <div className={this.props.options.length > 0 ? "has-data":"no-data"}>
                暂无数据!
              </div>
            </ul>                                    
		    </div>
	    </div>
    )
  }
})
export default CardList