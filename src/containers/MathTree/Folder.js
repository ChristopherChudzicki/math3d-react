import React from 'react'
import SortableList from './components/SortableList'
import { connect } from 'react-redux'

function Folder(props) {
  return (
    <div>
      Folder: {props.title}
      <SortableList
        droppableType='FOLDER_ITEM'
        draggableType='FOLDER_ITEM'
        droppableId={props.id}
        items={props.items}
        renderItem={
          (item) => (<div>{item}</div>)
        }
      />
    </div>
  )
}

const mapStateToProps = ( { mathTree }, ownProps) => ( {
  items: mathTree[ownProps.id].children,
  title: mathTree[ownProps.id].title
} )

export default connect(mapStateToProps)(Folder)
