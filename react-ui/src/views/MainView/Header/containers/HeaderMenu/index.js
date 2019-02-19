// @flow
import * as React from 'react'
import { Dropdown, Menu, Icon } from 'antd'
import theme from 'constants/theme'
import styled from 'styled-components'

const IconHolder = styled.span`
  display:flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height:48px;
  & i {
    font-size: 150%;
  }
`

const style = {
  display: 'flex',
  backgroundColor: theme.gray[1],
  borderBottom: `1px solid ${theme.gray[5]}`
}

type Props = {
  children: React.Node,
  collapsed: boolean
}

const HeaderMenu = (props: Props) => {

  return props.collapsed
    ? (
      <Dropdown overlay={(
        <Menu>{props.children}</Menu>
      )}>
        <a className="ant-dropdown-link" href="#">
          <IconHolder>
            <Icon type="menu-unfold" />
          </IconHolder>
        </a>
      </Dropdown>
    )
    : (
      <Menu
        style={style}
        mode={'horizontal'}
      >
        {props.children}
      </Menu>
    )
}

export default HeaderMenu
