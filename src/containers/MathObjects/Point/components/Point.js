import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import MathObject from 'containers/MathObjects/MathObject'
import Settings from 'containers/MathObjects/components/Settings'
import StatusSymbol from 'containers/MathObjects/components/StatusSymbol'
import MathQuill from 'components/MathQuill'
import styled from 'styled-components'
import { POINT } from 'containers/MathObjects/mathObjectTypes'

const MainRow = styled.div`
  position:relative;
  display:flex;
  align-items:center;
  justify-content:space-between;
`

const MainMathQuill = styled(MathQuill)`
  &.mq-editable-field.mq-math-mode {
    flex:1;
    max-width: calc(100% - 30px);
    font-size:125%;
    font-weight:bolder;
    padding:2px;
    border-top none;
    border-left: none;
    border-right: none;
    margin-bottom:1px;
    border-bottom: 1px solid ${props => props.theme.gray[5]};
    &.mq-focused {
      box-shadow:none;
      margin-bottom: 0px;
      border-bottom: 2px solid ${props => props.theme.primary[4]};
    }
  }
`

export default class Point extends PureComponent {

  state = {
    isSettingsVisible: false
  }

  static propTypes = {
    id: PropTypes.string.isRequired,
    coords: PropTypes.string.isRequired, // latex
    color: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    onEditCoords: PropTypes.func.isRequired,
    onToggleVisibility: PropTypes.func.isRequired,
    onSetColor: PropTypes.func.isRequired
  }

  onEditCoords = (mq) => {
    return this.props.onEditCoords(mq.latex())
  }

  render() {
    return (
      <MathObject
        id={this.props.id}
        type={POINT}
        sidePanelContent={
          <StatusSymbol
            color={this.props.color}
            isFilled={this.props.visible}
            onToggleVisibility={this.props.onToggleVisibility}
            onPickColor={this.props.onSetColor}
          />
        }
      >
        <MainRow
          innerRef={this.getRef}
        >
          <MainMathQuill
            latex={this.props.coords}
            onEdit={this.onEditCoords}
          />
          <Settings title='Point Settings'>
            <p>Hello</p>
            <p>World</p>
            <div style={ { height: '20px', width: '300px', backgroundColor: 'blue' } }/>
          </Settings>

        </MainRow>
      </MathObject>
    )
  }

}
