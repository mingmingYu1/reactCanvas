import React from 'react'
import classnames from 'classnames'
import './index.less'

export default React.createClass({
  isDown:false,
  getInitialState() {
    return {
      data: this.props.data
    }
  },
  handleMouseDown(event) {
    event.stopPropagation()
    this.isDown = true
    const BODY = document.body
    BODY.addEventListener('mousemove', this.handleMouseMove)
    BODY.addEventListener('mouseup', this.handleMouseUp)
  },
  handleMouseMove(event) {
    const slider = this.refs.dragline

    if(this.isDown) {
      const position = {
        x:event.pageX- slider.offsetLeft,
        y:event.pageY-slider.offsetTop
      }
      if(typeof this.props.onDraging == 'function') {
        this.props.onDraging(position)
      }
    }
  },
  handleMouseUp() {
    this.isDown = false

    const BODY = document.body
    BODY.removeEventListener('mousemove', this.handleMouseMove)
    BODY.removeEventListener('mouseup', this.handleMouseUp)
  },
  render() {
    return   (
        <div  ref="dragline" className={classnames('public-drag-control', this.props.className)} onMouseDown={this.handleMouseDown}  {...this.props} ></div>
    )
  }
})