import './index.less'
import React from 'react'
import Icon from 'bfd/Icon'

const DocumentCount = React.createClass({
  render() {
    const {title,count} = this.props;
    return (
      <div className="panel-card document-count">
        <h4 className="header">{title}</h4>              
        <div className="doc_list">
          <div className="pull-left icon">             
            <Icon type="file-text-o" />
          </div>
          <div className="pull-left">
            <p className="doc-num">{count}</p>
            <p className="doc-tip">文档数</p>
          </div>
          <div className="clear"></div>                     
        </div> 
      </div> 
    )
  }
})
export default DocumentCount