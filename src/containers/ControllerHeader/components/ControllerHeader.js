import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { Menu, Dropdown, Button, Icon } from 'antd'
import PropTypes from 'prop-types'
import { uniqueId } from 'lodash'

const ControllerHeaderContainer = styled.div`
  box-sizing:border-box;
  padding: 8px;
  height: ${props => props.height};
`
const NewObjectButton = styled(Button)`
  font-weight: bold;
  &.ant-btn, &.ant-btn:hover, &.ant-btn:focus {
    background-color:rgba(0,0,0,0);
  }
`

const GradientDiv = styled.div`
  display:inline-block;
  border-radius:4px; /*Same as ant-d*/
  background: linear-gradient(
    ${props => props.theme.gray[1]},
    ${props => props.theme.gray[4]}
    );
`

export default class ControllerHeader extends PureComponent {

  static propTypes = {
    height: PropTypes.string.isRequired,
    targetFolder: PropTypes.string.isRequired,
    newFolderIndex: PropTypes.number.isRequired,
    newItemIndex: PropTypes.number.isRequired,
    setActiveObject: PropTypes.func.isRequired,
    setContentCollapsed: PropTypes.func.isRequired,
    createPoint: PropTypes.func.isRequired,
    createFolder: PropTypes.func.isRequired
  }

  static defaultProps = {
    height: '50px'
  }

  handleMenuClick = ( { key } ) => {
    const id = uniqueId()

    if (key === 'createFolder') {
      this.props.createFolder(id, this.props.newFolderIndex)
    }
    else {
      const createMathObject = this.props[key]
      createMathObject(id, this.props.targetFolder, this.props.newItemIndex)
      this.props.setContentCollapsed(this.props.targetFolder, false)
    }

    this.props.setActiveObject(id)

  }

  renderMenu = () => {
    return (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key='createPoint'>Point</Menu.Item>
        <Menu.Item key="createFolder">Folder</Menu.Item>
      </Menu>
    )
  }

  render() {
    return (
      <ControllerHeaderContainer height={this.props.height}>
        <Dropdown
          overlay={this.renderMenu()}
          trigger={['click']}
        >
          <GradientDiv>
            <NewObjectButton>
              <Icon type="plus" />
              New Object
            </NewObjectButton>
          </GradientDiv>
        </Dropdown>
      </ControllerHeaderContainer>
    )
  }

}
