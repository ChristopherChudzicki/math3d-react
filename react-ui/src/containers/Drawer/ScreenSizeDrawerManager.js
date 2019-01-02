// @flow
import React from 'react'
import { connect } from 'react-redux'
import withSizes from 'react-sizes'
import { closeDrawer, openDrawer, setWidth } from './actions'
import { DEFAULT_WIDTH } from './reducer'

type Props = {
  isSmall: boolean,
  openDrawer: string => void,
  closeDrawer: string => void,
  setWidth: (id: string, width: string) => void,
  id: string
}

class ScreenSizeDrawerManager extends React.PureComponent<Props> {

  resize() {
    const { id, isSmall, closeDrawer, openDrawer, setWidth } = this.props
    if (isSmall) {
      closeDrawer(id)
      setWidth(id, '290px')
    }
    else {
      openDrawer(id)
      setWidth(id, DEFAULT_WIDTH)
    }
  }

  componentDidUpdate() {
    this.resize()
  }

  componentDidMount() {
    this.resize()
  }

  render() {
    return null
  }

}

const mapSizesToProps = ( { width } ) => ( { isSmall: width < 480 } )
const mapDispatchToProps = { openDrawer, closeDrawer, setWidth }

export default connect(null, mapDispatchToProps)(
  withSizes(mapSizesToProps)(ScreenSizeDrawerManager)
)
