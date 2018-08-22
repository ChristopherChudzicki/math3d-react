import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import MathObject from 'containers/MathObjects/MathObject'
import { MainRow } from 'containers/MathObjects/components'
import {
  MathInputLHS,
  MathInputRHS,
  StaticMathLarge
} from 'containers/MathObjects/containers/MathInput'
import { VARIABLE } from 'containers/MathObjects/mathObjectTypes'

export default class Variable extends PureComponent {

  static propTypes = {
    id: PropTypes.string.isRequired
  }

  render() {
    return (
      <MathObject
        id={this.props.id}
        type={VARIABLE}
      >
        <MainRow>
          <MathInputLHS
            parentId={this.props.id}
          />
          <StaticMathLarge
            latex='='
          />
          <MathInputRHS
            field='value'
            parentId={this.props.id}
          />
        </MainRow>
      </MathObject>
    )
  }

}
