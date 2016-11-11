import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import Highcharts from 'highcharts'
import classNames from 'classnames'
import './index.less'

export default React.createClass({

  contextTypes: {
    company: PropTypes.object
  },

  handleClick(titleKey) {
    this.context.company.setState({activeIndex: titleKey})
  },

  render() {

    let { className, title, value, style, titleKey, ...other} = this.props

    return (
      value ? <div className= 'public-titleTable'>
        <div className={classNames( 'overflow likeTables', className)}>
          <div className='clickTitle pull-left' style={style}  onClick={() => {this.handleClick(titleKey)}}>
            <div>{title.name}</div>
            <div>
              <span>{title.weight}:</span><span>{value.weight}</span>
            </div>
            <div>
              <span>{title.score}:</span><span>{value.score}</span>
            </div>
          </div>
          <div className="pull-left">
            <div>
              <span>{title.nameOne}</span><span>{value.nameOne}</span>
            </div>
            <div>
              <span>{title.nameTwo}</span><span>{value.nameTwo }</span>
            </div>
            <div>
              <span>{title.nameThree}</span><span>{value.nameThree }</span>
            </div>
          </div>
        </div>
      </div> : null
    )
  }
})
