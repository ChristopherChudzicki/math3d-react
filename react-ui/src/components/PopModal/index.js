// @flow
import * as React from 'react'
import { Popover, Modal, Button } from 'antd'
import withSizes from 'react-sizes'

type Props = {
  useModal: boolean,
  children: React.Node,
  popoverPlacement: ('top'
    | 'left'
    | 'right'
    | 'bottom'
    | 'topLeft'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomRight'
    | 'leftTop'
    | 'leftBottom'
    | 'rightTop'
    | 'rightBottom'
  ),
  popoverMaxWidth: string,
  title: string,
  source: React.Node,
  onVisibleChange?: (visible: boolean) => void
}

_PopModal.defaultProps = {
  popoverPlacement: 'bottomRight',
  popoverMaxWidth: '300px'
}

/**
 * PopModal:
 * Displays as a modal overlay on small screens, and a popover on large screens.
 * Threshhold is currently 570px.
 */
function _PopModal(props: Props) {
  // $FlowFixMe
  const [visible, _setVisible] = React.useState(false)
  function setVisible(visible: boolean) {
    _setVisible(visible)
    if (props.onVisibleChange) {
      props.onVisibleChange(visible)
    }
  }

  return props.useModal
    ? (
      <>
        <Modal
          title={props.title}
          visible={visible}
          onCancel={() => setVisible(!visible)}
          maskClosable={true}
          style={ { maxWidth: props.popoverMaxWidth } }
          footer={[
            <Button key='ok' onClick={() => setVisible(!visible)}>
              OK
            </Button>
          ]}
        >
          {props.children}
        </Modal>
        <span onClick={() => setVisible(!visible)}>
          {props.source}
        </span>
      </>
    )
    : (
      <Popover
        placement={props.popoverPlacement}
        overlayStyle={ { maxWidth: props.popoverMaxWidth } }
        title={props.title}
        content={props.children}
        trigger='click'
      >
        {props.source}
      </Popover>
    )

}

const mapSizesToProps = ( { width } ) => ( { useModal: width < 570 } )

export default withSizes(mapSizesToProps)(_PopModal)
