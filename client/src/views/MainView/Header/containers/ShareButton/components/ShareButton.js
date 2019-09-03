// @flow
import React, { PureComponent } from 'react'
import { Button, Icon, Input } from 'antd'
import PopModal from 'components/PopModal'
import { saveGraph } from 'services/api'
import { dehydrate } from 'store/hydration'
import randomstring from 'randomstring'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import typeof { setProperty as SetProperty } from 'containers/MathObjects/actions'
import typeof { setCreationDate as SetCreationDate } from 'services/metadata/actions'
import getCameraData from 'services/getCameraData'
import { CAMERA } from 'containers/MathObjects'
import styled, { keyframes } from 'styled-components'

const SharePopoverContainer = styled.div`
  max-width: 300px;
  display: flex;
  align-items: center;
  flex-direction:column;
`

const CopyContainer = styled.div`
  display: flex;
  align-items: center;
`

const fadeIn = keyframes`
  from { opacity: 0 }
  to { opacity: 1 }
`
const CopyStatus = styled.div`
  font-size: 125%;
  width: 75px;
  margin: 10px;
  color: ${props => props.theme.primary[4]};
  font-weight: strong;
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  animation: ${props => props.isVisible ? fadeIn : ''} 100ms linear;
`

const copyButtonStyle = { margin: '10px' }

type Props = {
  onClick: () => void,
  // We need access to state, but no need to rerender on ever state change.
  // So pass getState instead.
  getState: () => {},
  setProperty: SetProperty,
  setCreationDate: SetCreationDate
}
type State = {
  id: ?string,
  isCopied: boolean
}

const URL_FRONT = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000'
  : 'https://www.math3d.org'

export default class ShareButton extends PureComponent<Props, State> {

  state = {
    id: null,
    isCopied: false
  }

  dehydratedJson: ?string

  getId() {
    return randomstring.generate(8)
  }

  saveCameraData = () => {
    const { position, lookAt } = getCameraData()
    const id = 'camera'
    const type = CAMERA
    this.props.setProperty(id, type, 'relativePosition', position)
    this.props.setProperty(id, type, 'relativeLookAt', lookAt)
  }

  saveGraph = () => {
    this.saveCameraData()
    this.props.setCreationDate()
    const state = this.props.getState()
    const dehydrated = dehydrate(state)
    const id = this.getId()
    saveGraph(id, dehydrated)
    this.setState( { id } )
    this.dehydratedJson = JSON.stringify(dehydrated)
  }

  onCopy = () => {
    this.setState( { isCopied: true } )
  }

  onVisibleChange = (visible: boolean) => {
    if (!visible) {
      this.setState( { isCopied: false } )
    }
  }

  renderContent() {
    const url = this.state.id && `${URL_FRONT}/${this.state.id}`
    return (
      <SharePopoverContainer>
        <Input readOnly={true} value={url}/>
        <CopyContainer>
          <CopyToClipboard text={url} onCopy={this.onCopy}>
            <Button type='primary' style={copyButtonStyle} >Copy</Button>
          </CopyToClipboard>
          <CopyStatus isVisible={this.state.isCopied}>
            Copied!
          </CopyStatus>
        </CopyContainer>
        {
          process.env.NODE_ENV === 'development' && (
            <CopyToClipboard text={this.dehydratedJson}>
              <Button type='danger'>Copy Dehydrated State (Dev Only)</Button>
            </CopyToClipboard>
          )
        }

      </SharePopoverContainer>
    )
  }

  render() {
    return (
      <PopModal
        title={'Share your scene'}
        onVisibleChange={this.onVisibleChange}
        source={
          <span
            onPointerDown={this.saveCameraData}
            onClick={this.saveGraph}
          >
            <Icon type='cloud' style={ { paddingRight: '4px' } } />
            Share
          </span>
        }
      >
        {this.renderContent()}
      </PopModal>
    )
  }

}
