import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Icon } from 'antd'
import SubtleButton from 'components/SubtleButton'

const StyledButton = styled(SubtleButton)`
  z-index:200;
  width:30px;
  height:30px;
  margin: ${props => props.buttonSide === 'left'
    ? '0 0 0 -30'
    : '0 -30 0 0'
};
`

// slideTo, isDrawerOpen
const buttonIcons = {
  left: {
    true: 'left',
    false: 'right'
  },
  right: {
    true: 'right',
    false: 'left'
  }
}

export default class DrawerToggleButton extends PureComponent {

  static propTypes = {
    onClose: PropTypes.func.isRequired,
    onOpen: PropTypes.func.isRequired,
    isDrawerOpen: PropTypes.bool.isRequired,
    slideTo: PropTypes.oneOf( ['left', 'right'] ),
    side: PropTypes.oneOf( ['left', 'right'] )
  }

  render() {
    const props = this.props
    const onClick = props.isDrawerOpen ? props.onClose : props.onOpen
    const iconType = buttonIcons[props.slideTo][props.isDrawerOpen]
    return (
      <StyledButton onClick={onClick} side={props.side}>
        <Icon type={iconType} />
      </StyledButton>
    )
  }

}
