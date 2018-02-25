import React from 'react'
import PropTypes from 'prop-types'

export default function Drawer(props) {
  return (
    <div>
      <span>Drawer Visibility: {JSON.stringify(props.isVisible)}</span>
      <div>
        {props.children}
      </div>
    </div>
  )
}

Drawer.propTypes = {
  isVisible: PropTypes.bool,
  children: PropTypes.oneOfType( [
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ] ).isRequired
}
