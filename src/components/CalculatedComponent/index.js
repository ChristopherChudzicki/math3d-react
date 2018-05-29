import React, { Component } from 'react'
import PropTypes from 'prop-types'

// TODO: Finish this component and add tests. Paused to work on error handling

export class CalculatedComponent extends Component {

  static propTypes = {
    scope: PropTypes.objectOf(PropTypes.string).isRequired,
    calculatedProps: PropTypes.objectOf(PropTypes.string).isRequired
  }

  scope = {}

  shouldComponentUpdate() {
    // only update if used symbols have updated
  }

  render() {
    return null
  }

}
