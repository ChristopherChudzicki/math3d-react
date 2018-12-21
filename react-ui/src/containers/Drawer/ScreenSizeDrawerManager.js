// @flow
import { connect } from 'react-redux'
import withSizes from 'react-sizes'
import { closeDrawer, openDrawer } from './actions'

type Props = {
  isSmall: boolean,
  openDrawer: string => void,
  closeDrawer: string => void,
  id: string
}

function ScreenSizeDrawerManager(props: Props) {
  console.log(props.isSmall)
  if (props.isSmall) {
    props.closeDrawer(props.id)
  }
  else {
    props.openDrawer(props.id)
  }

  return null
}

const mapSizesToProps = ( { width } ) => ( { isSmall: width < 480 } )
const mapDispatchToProps = { openDrawer, closeDrawer }

export default connect(null, mapDispatchToProps)(
  withSizes(mapSizesToProps)(ScreenSizeDrawerManager)
)
