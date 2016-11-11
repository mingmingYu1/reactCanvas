import React from 'react'
import classnames from 'classnames'
import './index.less'

const Step = React.createClass({
    render() {
        const index = this.props.index+1
        const title = this.props.title
        const smalltitle = this.props.smalltitle
        const className = this.props.active?"active":""
        return <li className={className}>
                    <a data-toggle="tab">
                        <label className="wizard-step">{index}</label>
                          <span className="wizard-description">
                              {title}
                             <small>{smalltitle}</small>
                          </span>
                    </a>
                </li>
    }
})

const Steps = React.createClass({
    getInitialState() {
        return {
            current: this.props.current
        }
    },
    render() {

        let rows = [];
        const { children } = this.props;
        const items = children;
        items.map((item, index) => {
            rows.push(<Step
                key={index}
                index={index}
                active={this.props.current == index?true:false}
                icon = {item.props.icon}
                title={item.props.title || ''}
                smalltitle={item.props.smalltitle || ''}
                />)
        })

        return (
            <div  ref='container' className={classnames('form-wizard', this.props.className)}>
                <ul>
                {rows}
                </ul>
            </div>
        )
    }
})

export {
    Steps,
    Step
}