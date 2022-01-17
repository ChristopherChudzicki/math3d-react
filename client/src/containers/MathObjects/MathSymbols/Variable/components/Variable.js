import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import MathObjectUI from 'containers/MathObjects/MathObjectUI'
import { MainRow } from 'containers/MathObjects/components'
import {
  MathInputLHS,
  MathInputRHS,
  MathTextOutput,
  StaticMathStyled
} from 'containers/MathObjects/containers/MathInput'
import { VARIABLE } from '../metadata'

const justifyRight = {
  justifyContent: 'flex-end'
}

export default class Variable extends PureComponent {

  static propTypes = {
    id: PropTypes.string.isRequired
  }

  render() {
    return (
      <MathObjectUI
        id={this.props.id}
        type={VARIABLE}
      >
        <MainRow>
          <MathInputLHS
            parentId={this.props.id}
          />
          <StaticMathStyled
            latex='='
          />
          <MathInputRHS
            field='value'
            parentId={this.props.id}
          />
        </MainRow>
        <MainRow style={justifyRight}>
          <MathTextOutput
            parentId={this.props.id}
            field='value'
          />
        </MainRow>
      </MathObjectUI>
    )
  }

}
