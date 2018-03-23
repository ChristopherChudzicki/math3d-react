import React from 'react'
import styled from 'styled-components'
// ant design also has an autosizing textarea, but I found it too hard to resize
import Textarea from 'react-textarea-autosize'
import PropTypes from 'prop-types'

const StyledTextarea = styled(Textarea)`
  width: 700px;
  max-width: calc(100% - 35px);
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
    margin-bottom: -1px;
  }
`

EditableDescription.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default function EditableDescription(props) {
  return (
    <StyledTextarea
      rows={1}
      value={props.value}
      onChange={e => props.onChange(e.target.value)}
    />
  )
}

// TODO: Currently we autosize the height only. It would be nice to autosize the
// width also. Possibly using this method:
// https://stackoverflow.com/a/21015393/2747370
// would need to cap at max-width at some point.
