import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { Icon } from 'antd'
import SubtleButton from 'components/SubtleButton'

const StyledButton = styled(SubtleButton)`
  z-index:200;
  width:30px;
  height:30px;
  ${props => props.side === 'right' && css`
    margin-right: -30px;
  `};
  ${props => props.side === 'left' && css`
    margin-left: -30px;
    padding-left: 30px;
    & > i {
      margin-left: -30px;
    }
  `};
}
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
