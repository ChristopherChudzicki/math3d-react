// @flow
import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { Menu, Dropdown, Button, Icon } from 'antd'
import idGenerator from 'constants/idGenerator'
import typeof {
  createMathObject as CreateMathObject
} from 'containers/MathObjects/actions'
import { FOLDER } from 'containers/MathObjects/Folder/metadata'

const ControllerHeaderContainer = styled.div`
  box-sizing:border-box;
  padding: 8px;
  height: ${props => props.height};
  display: flex;
  align-items:center;
  justify-content:center;
`
const NewObjectButton = styled(Button)`
  font-weight: bold;
  &.ant-btn, &.ant-btn:hover, &.ant-btn:focus {
    padding-left: 30px;
    padding-right: 30px;
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

type MenuItem = {
  type: string,
  description: string
}

type Props = {
  height: string,
  targetFolder: string,
  newFolderIndex: number,
  newItemIndex: number,
  setActiveObject: (string) => void,
  setContentCollapsed: (string, bool) => void,
  menuItems: Array<MenuItem>,
  createMathObject: CreateMathObject
}

export default class ControllerHeader extends PureComponent<Props> {

  static defaultProps = {
    height: '50px'
  }

  handleMenuClick = ( { key } : { key: string } ) => {
    const id = idGenerator.next()
    const parentFolderId = key === FOLDER
      ? 'root'
      : this.props.targetFolder
    const positionInFolder = key === FOLDER
      ? this.props.newFolderIndex
      : this.props.newItemIndex

    this.props.createMathObject(id, key, parentFolderId, positionInFolder)

    if (key !== FOLDER) {
      this.props.setContentCollapsed(this.props.targetFolder, false)
    }

    this.props.setActiveObject(id)

  }

  renderMenuItem = ( { type, description } : MenuItem) => {
    return <Menu.Item key={type}>{description}</Menu.Item>
  }

  renderMenu = () => {
    return (
      <Menu onClick={this.handleMenuClick}>
        {this.props.menuItems.map(this.renderMenuItem)}
      </Menu>
    )
  }

  render() {
    return (
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
    )
  }

}
