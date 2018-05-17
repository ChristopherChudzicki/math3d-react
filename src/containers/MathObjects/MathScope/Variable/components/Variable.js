import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import MathObject from 'containers/MathObjects/MathObject'
import {
  MathQuillLarge,
  StaticMathLarge,
  MainRow
} from 'containers/MathObjects/components'
import { VARIABLE } from 'containers/MathObjects/mathObjectTypes'

export default class Variable extends PureComponent {

  static propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired, // latex
    name: PropTypes.string.isRequired, // latex
    onEditValue: PropTypes.func.isRequired,
    onEditName: PropTypes.func.isRequired
  }

  onEditValue = (mq) => {
    return this.props.onEditValue(mq.latex())
  }

  onEditName = (mq) => {
    return this.props.onEditName(mq.latex())
  }

  render() {
    return (
      <MathObject
        id={this.props.id}
        type={VARIABLE}
      >
        <MainRow
          innerRef={this.getRef}
        >
          <MathQuillLarge
            style={{ flex: 0 }}
            latex={this.props.name}
            onEdit={this.onEditName}
          />
          <StaticMathLarge
            latex='='
          />
          <MathQuillLarge
            latex={this.props.value}
            onEdit={this.onEditValue}
          />
        </MainRow>
      </MathObject>
    )
  }

}
