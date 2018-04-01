import React from 'react'
import styled from 'styled-components'
import SubtleButton from 'components/SubtleButton'
import { Icon } from 'antd'

const StyledSettingsButton = styled(SubtleButton)`
  width:30px;
  height:30px;
  display:flex;
  justify-content:center;
  align-items:center;
  font-size:150%;
  color: ${props => props.theme.medium};
`

export default function SettingsButton(props) {
  return (
    <StyledSettingsButton>
      <Icon
        type='setting'
      />
    </StyledSettingsButton>
  )
}
