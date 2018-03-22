import React from 'react'
import styled from 'styled-components'
import SubtleButton from 'components/SubtleButton'
import { Icon } from 'antd'

const StyledDeleteButton = styled(SubtleButton)`
  padding:0px;
  min-width:25px;
  max-width:25px;
  height:25px;
  display:flex;
  justify-content: center;
  align-items: center;
`

export default function DeleteButton(props) {
  return (
    <StyledDeleteButton {...props} >
      <Icon
        type='close'
      />
    </StyledDeleteButton>
  )
}
