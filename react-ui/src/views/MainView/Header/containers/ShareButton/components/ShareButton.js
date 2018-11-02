// @flow
import React, { PureComponent } from 'react'
import { Button, Popover, Icon } from 'antd'
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
    const url = this.state.id && `https://math3d-react.herokuapp.com/${this.state.id}`
    return (
      <div style={ { width: 400 } }>
        <pre>
          {url}
        </pre>
        <p>
          <Icon type="warning" theme="outlined" /> This updated version of math3d is in <strong>beta</strong>.
          Graphs saved now may not work in the future.
        </p>
      </div>
    )
  }

  render() {
    return (
      <Popover placement="bottomRight" title={'Share'} content={this.renderContent()} trigger="click">
        <Button size='small' type='ghost' onClick={this.saveGraph}>
          Share
        </Button>
      </Popover>
    )
  }

}
