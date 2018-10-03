// @flow
import React, { PureComponent } from 'react'
import { Button, Popover } from 'antd'
import { saveGraph } from 'services/api'
import { dehydrate } from 'store/hydration'
import randomstring from 'randomstring'

type Props = {
  onClick: () => void,
  state: {}
}
type State = {
  id: ?string
}

export default class ShareButton extends PureComponent<Props, State> {

  state = {
    id: null
  }

  getId() {
    return randomstring.generate( { length: 1 } ) +
      randomstring.generate( { length: 7, charset: 'alphanumeric' } )
  }

  saveGraph = () => {
    const dehydrated = dehydrate(this.props.state)
    const id = this.getId()
    saveGraph(id, dehydrated)
    this.setState( { id } )
  }

  renderContent() {
    return (
      <div>
        <pre>
          {this.state.id && `http://localhost:3000/load/${this.state.id}`}
        </pre>
      </div>
    )
  }

  render() {
    return (
      <Popover placement="bottomRight" title={'Title'} content={this.renderContent()} trigger="click">
        <Button size='small' type='ghost' onClick={this.saveGraph}>
          Share
        </Button>
      </Popover>
    )
  }

}
