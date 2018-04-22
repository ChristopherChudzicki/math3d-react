import React from 'react'
import PropType from 'prop-types'
import styled from 'styled-components'
import ColorSquare from './ColorSquare'

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 30px);
  grid-auto-rows: 30px;
  grid-gap: 5px;
`

export default class Swatch extends React.Component {

  static propTypes = {
    colors: PropType.arrayOf(PropType.string).isRequired,
    onPickColor: PropType.func.isRequired
  }

  onPickColor = (color) => {
    this.props.onPickColor(color)
  }

  render() {
    return (
      <Container>
        {this.props.colors.map(color =>
          <ColorSquare
            color={color}
            onPickColor={this.onPickColor}
            key={color}
          />
        )}
      </Container>
    )
  }

}
