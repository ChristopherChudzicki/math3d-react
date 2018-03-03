import SortableList from './components/SortableList'
import { connect } from 'react-redux'

const mapStateToProps = ( { draggables }, ownProps) => ( {
  draggables: draggables[ownProps.id]
} )

const mapDispatchToProps = (dispatch, ownProps) => ( {

} )

export default connect(mapStateToProps, mapDispatchToProps)(SortableList)
