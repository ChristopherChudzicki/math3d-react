// @flow
import React from 'react'
import { StaticMathStyled } from 'containers/MathObjects/containers/MathInput'
import styled from 'styled-components'
import { colorMaps } from 'constants/colors'

const ScaleContainer = styled.div`
  display:flex;
  align-items:center;
  margin:4px;
`
const ColorBar = styled.div`
  flex:1;
  ${props => props.gradient};
  background-color: ${props => props.color};
  height:10px;
`

type Props = {
  color: string
}

export function ColorScale(props: Props) {
  const { color } = props
  const gradient = colorMaps[color] && colorMaps[color].css
  return (
    <ScaleContainer>
      <StaticMathStyled latex='0'/>
      <ColorBar gradient={gradient} color={color}/>
      <StaticMathStyled latex='1'/>
    </ScaleContainer>
  )
}
