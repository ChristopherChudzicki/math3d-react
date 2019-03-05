// @flow
import * as React from 'react'
import styled from 'styled-components'
import { Menu, Dropdown, Button, Icon } from 'antd'
import idGenerator from 'constants/idGenerator'
import typeof {
  createMathObject as CreateMathObject
} from 'containers/MathObjects/actions'
import { FOLDER } from 'containers/MathObjects/Folder/metadata'
import type { Support } from 'containers/MathObjects/MathObject'

const NewObjectButton = styled(Button)`
  font-weight: bold;
  &.ant-btn, &.ant-btn:hover, &.ant-btn:focus {
    padding-left: 20px;
    padding-right:20px;
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
  &.ant-dropdown-trigger {
    line-height: 1.5;
    margin-top:16px;
    margin-bottom:16px;
    margin-right:16px;
  };
`

const WarningSpan = styled.span`
  color: ${props => props.theme.gray[5]}
`

type MenuItem = {
  type: string,
  description: string,
  support: Support
}

export type OwnProps = {|
  menuItems: Array<MenuItem>
|}
type StateProps = {|
  targetFolder: string,
  newFolderIndex: number,
  newItemIndex: number,
|}
type DispatchProps = {|
  setActiveObject: (string) => void,
  setContentCollapsed: (string, boolean) => void,
  createMathObject: CreateMathObject
|}
export type Props = {|
  ...OwnProps,
  ...StateProps,
  ...DispatchProps
|}

export default class ControllerHeader extends React.PureComponent<Props> {

  handleMenuClick = ( { key }: { key: string } ) => {
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

  renderMenuItem = ( { type, description, support }: MenuItem) => {
    return (
      <Menu.Item key={type}>
        {description}
        {support === 'experimental' && (
          <WarningSpan>
            {' '}( <Icon type="experiment" /> Unstable Feature)
          </WarningSpan>
        )}
      </Menu.Item>
    )
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
            Add Object
          </NewObjectButton>
        </GradientDiv>
      </Dropdown>
    )
  }

}
