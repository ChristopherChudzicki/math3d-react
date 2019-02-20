// @flow
import * as React from 'react'
import { Dropdown, Button, Menu, Icon } from 'antd'
import theme from 'constants/theme'
import styled from 'styled-components'
import withSizes from 'react-sizes'

const IconHolder = styled.span`
  display:flex;
  justify-content: center;
  align-items: center;
  width: 48px;
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

const _HeaderMenu = (props: Props) => {

  return props.collapsed
    ? (
      <Dropdown overlay={(
        <Menu>{props.children}</Menu>
      )}>
        <Button>
          <IconHolder>
            <Icon type="menu-unfold" />
          </IconHolder>
        </Button>
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

const mapSizesToProps = ( { width } ) => ( { collapsed: width < 570 } )

export default withSizes(mapSizesToProps)(_HeaderMenu)
