import React from 'react'
import styled from 'styled-components'
import { Menu, Dropdown, Button, Icon } from 'antd'

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

function handleMenuClick(e) {
  console.log('click', e)
}

const menu = (
  <Menu onClick={handleMenuClick}>
    <Menu.Item key="1">1st menu item</Menu.Item>
    <Menu.Item key="2">2nd menu item</Menu.Item>
    <Menu.Item key="3">3rd item</Menu.Item>
  </Menu>
)

export default function ControllerHeader(props) {
  return (
    <ControllerHeaderContainer height={props.height}>
      <Dropdown overlay={menu} trigger={['click']}>
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
