import React, { PureComponent } from 'react'
import SettingsButton from './SettingsButton'
import { Popover, Icon } from 'antd'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import SubtleButton from '../../../../../components/SubtleButton'
const TitleBar = styled.div`
  display: flex;
  justify-content: space-between;
`
const CloseButton = styled(SubtleButton)`
  width:30px;
  height:30px;
`

export default class SettingsContainer extends PureComponent {

  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.oneOfType( [
      PropTypes.string,
      PropTypes.node,
      PropTypes.arrayOf(PropTypes.node)
    ] ).isRequired
  }

  state = {
    isVisible: false
  }

  handleVisibleChange = (isVisible) => {
    this.setState( { isVisible } )
  }

  closePopover = () => {
    this.setState( { isVisible: false } )
  }

  render() {
    return (
      <Popover
        content={this.props.children}
        title={
          <TitleBar>
            <h3>{this.props.title}</h3>
            <CloseButton onClick={this.closePopover}>
              <Icon type="close" />
            </CloseButton>
          </TitleBar>
        }
        trigger='click'
        placement='right'
        visible={this.state.isVisible}
        onVisibleChange={this.handleVisibleChange}
      >
        <SettingsButton />
      </Popover>
    )
  }

}
