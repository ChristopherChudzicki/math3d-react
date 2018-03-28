import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import MathObject from 'containers/MathObjects/MathObject'
import MathQuill from 'components/MathQuill'

export default class Point extends PureComponent {

  static propTypes = {
    coords: PropTypes.string.isRequired, // latex
    onEditCoords: PropTypes.func.isRequired
  }

  onEditCoords = (mq) => {
    return this.props.onEditCoords(mq.latex())
  }

  render() {
    return (
      <MathObject {...this.props}>
        <MathQuill
          latex={this.props.coords}
          onEdit={this.onEditCoords}
        />
      </MathObject>
    )
  }

}
