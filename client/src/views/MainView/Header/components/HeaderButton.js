// @flow
import styled from 'styled-components'

export default styled.span`
  color: ${props => props.theme.gray[5]};
  font-size: ${props => props.type === 'brand' ? '130%' : '115%'};
  font-weight: ${props => props.type === 'brand' ? 900 : 'default'};
`
