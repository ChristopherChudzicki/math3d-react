import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import MathObject from 'containers/MathObjects/MathObject'
import Settings from 'containers/MathObjects/components/Settings'
import StatusSymbol from 'containers/MathObjects/components/StatusSymbol'
import MathQuill from 'components/MathQuill'
import styled from 'styled-components'

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
    border-bottom: 1pt solid ${props => props.theme.medium};
    &.mq-focused {
      outline-width:0px;
      box-shadow:none;
      border-bottom: 2px solid ${props => props.theme.primary};
    }
  }
`

export default class Point extends PureComponent {

  state = {
    isSettingsVisible: false
  }

  static propTypes = {
    coords: PropTypes.string.isRequired, // latex
    onEditCoords: PropTypes.func.isRequired
  }

  onEditCoords = (mq) => {
    return this.props.onEditCoords(mq.latex())
  }

  render() {
    return (
      <MathObject {...this.props}
        sidePanelContent={<StatusSymbol/>}
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
            <div style={{height:'20px', width:'300px', backgroundColor: 'blue'}}/>
          </Settings>

        </MainRow>
      </MathObject>
    )
  }

}
