// @flow
import React from 'react'
import styled from 'styled-components'
import ColorSquare from './ColorSquare'
import { colors } from '../../../../../../../../constants/colors'

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 30px);
  grid-auto-rows: 30px;
  grid-gap: 5px;
`

type Props = {
  colors: Array<string>,
  onPickColor: (color: string) => void
}

export default class ColorPicker extends React.Component<Props> {

  static defaultProps = {
    colors: colors
  }

  onPickColor = (color: string) => {
    this.props.onPickColor(color)
  }

  render() {
    return (
      <Container>
        {
          this.props.colors.map(color =>
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
