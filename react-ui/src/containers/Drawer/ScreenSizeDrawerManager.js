// @flow
import React from 'react'
import { connect } from 'react-redux'
import withSizes from 'react-sizes'
import { closeDrawer, openDrawer } from './actions'

type Props = {
  isSmall: boolean,
  openDrawer: string => void,
  closeDrawer: string => void,
  id: string
}

class ScreenSizeDrawerManager extends React.PureComponent<Props> {

  resize() {
    const { id, isSmall, closeDrawer, openDrawer } = this.props
    if (isSmall) {
      closeDrawer(id)
    }
    else {
      openDrawer(id)
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
const mapDispatchToProps = { openDrawer, closeDrawer }

export default connect(null, mapDispatchToProps)(
  withSizes(mapSizesToProps)(ScreenSizeDrawerManager)
)
