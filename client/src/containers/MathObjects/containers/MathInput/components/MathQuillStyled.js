// @flow
import MathQuill, { StaticMath } from '../../../../../components/MathQuill'
import styled, { css } from 'styled-components'

const borderStyling = css`
  border-top none;
  border-left: none;
  border-right: none;
  margin-bottom:1px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.gray[5]};
  &.mq-focused {
    box-shadow:none;
    margin-bottom: 0px;
    border-bottom-width: 2px;
    border-bottom-color: ${props => props.theme.primary[4]}
  };
`

const errorStyling = css`
  &, &.mq-focused {
    border-bottom-color: red;
  }
`

const alignmentStyling = css`
  align-self:stretch;
  display: flex;
  align-items:center;
  padding:2px;
`

export const MathQuillStyled = styled(MathQuill)`
  &.mq-editable-field.mq-math-mode {
    flex:1;
    max-width: 100%;
    font-size: ${props => props.size === 'small' ? '100%' : '125%'};
    font-weight:bolder;
    ${borderStyling};
    ${props => props.hasError && errorStyling};
    ${alignmentStyling};
  }
`
// To help enzyme; finding by component reference not working
MathQuillStyled.displayName = 'MathQuillStyled'

export const StaticMathStyled = styled(StaticMath)`
  &.mq-math-mode {
    max-width: calc(100% - 30px);
    font-size: ${props => props.size === 'small' ? '100%' : '125%'};
    font-weight:bolder;
    ${alignmentStyling};
  }
`
