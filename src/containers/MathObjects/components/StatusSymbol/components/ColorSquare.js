import React from 'react'
import styled from 'styled-components'
import PropType from 'prop-types'

const Color = styled.div`
  background-color: ${props => props.color};
  border-radius: 5px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  &:hover {
    border: 1px solid black;
  }
`

export default class ColorSquare extends React.PureComponent {

  static propTypes = {
    color: PropType.string.isRequired,
    onPickColor: PropType.func.isRequired
  }

  pickColor = () => {
    this.props.onPickColor(this.props.color)
  }

  render() {
    return (
      <Color
        color={this.props.color}
        onClick={this.pickColor}
      />
    )
  }

}
