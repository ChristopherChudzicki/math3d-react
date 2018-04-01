import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import MathObject from 'containers/MathObjects/MathObject'
import MathQuill from 'components/MathQuill'
import styled from 'styled-components'
import SettingsButton from 'containers/MathObjects/components/SettingsButton'

const MainRow = styled.div`
  position:relative;
  display:flex;
  align-items:center;
  justify-content:space-between;
`

const MQContainer = styled.div`
  flex:1;
`

const MainMathQuill = styled(MathQuill)`
  &.mq-editable-field.mq-math-mode {
    flex:1;
    max-width: calc(100% - 30px);
    font-size:125%;
    padding:2px;
    border-top none;
    border-left: none;
    border-right: none;
    border-bottom: 1pt solid ${props => props.theme.medium};
    background-color: white;
    &.mq-focused {
      outline-width:0px;
      box-shadow:none;
      border-bottom: 2px solid ${props => props.theme.primary};
    }
  }
`

export default class Point extends PureComponent {

  static propTypes = {
    coords: PropTypes.string.isRequired, // latex
    onEditCoords: PropTypes.func.isRequired
  }

  onEditCoords = (mq) => {
    return this.props.onEditCoords(mq.latex())
  }

  render() {
    return (
      <MathObject {...this.props}>
        <MainRow>
          <MainMathQuill
            latex={this.props.coords}
            onEdit={this.onEditCoords}
          />
          <SettingsButton/>
        </MainRow>
      </MathObject>
    )
  }

}
