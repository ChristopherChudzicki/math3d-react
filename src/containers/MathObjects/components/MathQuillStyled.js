import MathQuill, { StaticMath } from 'components/MathQuill'
import styled, { css } from 'styled-components'

const borderStyling = css`
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
`

const alignmentStyling = css`
  align-self:stretch;
  display: flex;
  align-items:center;
  padding:2px;
`

export const MathQuillLarge = styled(MathQuill)`
  &.mq-editable-field.mq-math-mode {
    flex:1;
    max-width: calc(100% - 30px);
    font-size:125%;
    font-weight:bolder;
    ${alignmentStyling};
    ${borderStyling};
  }
`

export const StaticMathLarge = styled(StaticMath)`
  &.mq-math-mode {
    max-width: calc(100% - 30px);
    font-size:125%;
    font-weight:bolder;
    ${alignmentStyling};
  }
`
