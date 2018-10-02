// @flow
import React, { PureComponent } from 'react'
import { Button, Popover } from 'antd'

type Props = {
  onClick: () => void
}

export default class ShareButton extends PureComponent<Props> {

  renderContent() {
    return (
      <div>
        <pre>
          cat
        </pre>
      </div>
    )
  }

  render() {
    return (
      <Popover placement="bottomRight" title={'Title'} content={this.renderContent()} trigger="click">
        <Button size='small' type='ghost'>
          Share
        </Button>
      </Popover>
    )
  }

}
