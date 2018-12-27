// @flow
import React from 'react'
import styled from 'styled-components'

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

type Props = {
  color: string,
  style?: string,
  className?: string,
  onPickColor: (color: string) => void
}

export default class ColorSquare extends React.PureComponent<Props> {

  pickColor = () => {
    this.props.onPickColor(this.props.color)
  }

  render() {
    return (
      <Color
        style={this.props.style}
        className={this.props.className}
        color={this.props.color}
        onClick={this.pickColor}
      />
    )
  }

}
