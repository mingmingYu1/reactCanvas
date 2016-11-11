'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

//require('bfd-bootstrap');

require('./main.less');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ClearableInput = require('bfd-ui/lib/ClearableInput');

var _ClearableInput2 = _interopRequireDefault(_ClearableInput);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
  displayName: 'SearchInput',

  value: '',
  propTypes: {
    onSearch: _react2.default.PropTypes.func.isRequired
  },
  handleChange: function handleChange(v) {
    this.value = v;
    this.props.onChange && this.props.onChange(v);
  },
  handleClick: function handleClick() {
    if (typeof this.props.onSearch == 'function') {
      this.props.onSearch(this.value);
    }
  },
  render: function render() {
    var size = this.props.size || 'lg';
    return _react2.default.createElement(
      'div',
      { className: (0, _classnames2.default)('bfd-search_input', this.props.className, size) },
      _react2.default.createElement(_ClearableInput2.default, { size: size, onChange: this.handleChange, inline: true, placeholder: this.props.placeholder || '' }),
      _react2.default.createElement(
        'button',
        { className: (0, _classnames2.default)('btn btn-primary', size), type: 'button', onClick: this.handleClick },
        this.props.label || '搜索'
      )
    );
  }
}); /**
     * Created by tenglong.jiang on 2016-05-13.
     */