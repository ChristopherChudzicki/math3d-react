import React from 'react'
import styled from 'styled-components'
// ant design also has an autosizing textarea, but I found it too hard to resize
import Textarea from 'react-textarea-autosize'

const StyledTextarea = styled(Textarea)`
  width:100%;
  resize: none;
  border-top:none;
  border-left: none;
  border-right:none;
  border-radius: 0px;
  padding-bottom: 0px;
  padding-top: 0px;
  border-bottom: 1px solid ${props => props.theme.medium};
  color: ${props => props.theme.dark};
  &:focus {
    outline-width:0px;
    border-bottom: 2px solid ${props => props.theme.primary};
  }
`

export default function EditableDescription(props) {
  return (
    <StyledTextarea
      rows={1}
    />
  )
}
