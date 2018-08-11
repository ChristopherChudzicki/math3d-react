import React, { PureComponent } from 'react'
import MathBox, { Point, Grid, Cartesian } from 'components/MathBox/MathBox'
import { MathScopeConsumer } from 'containers/MathScopeContext'
import PropTypes from 'prop-types'
import { parser } from 'constants/parsing'
import { EvalErrorData } from 'services/errors'

// TODO: This is a connected component. Should we move it into containers?

export default class MathBoxScene extends PureComponent {

  static propTypes = {
    order: PropTypes.array.isRequired,
    mathGraphics: PropTypes.object.isRequired,
    evalErrors: PropTypes.object.isRequired,
    setError: PropTypes.func.isRequired
  }

  evalData(id, data, scope) {
    const { setError, evalErrors } = this.props

    // TODO: get the toEval array from mathobject type
    const toEval = ['coords']
    const evaluated = toEval.reduce((acc, prop) => {
      try {
        const parsed = parser.parse(data[prop] )
        try {
          acc[prop] = parsed.eval(scope)
          // clear any old evaluation errors
          evalErrors[id][prop] && setError(id, prop, new EvalErrorData(null))
          return acc
        }
        catch (evalError) {
          setError(id, prop, new EvalErrorData(evalError.message))
          delete acc[prop]
          return acc
        }
      }
      catch (parseError) {
        delete acc[prop]
        return acc
      }

    }, { ...data } )

    return evaluated
  }

  render() {
    const { mathGraphics, setError } = this.props
    return (
      <MathScopeConsumer>
        {( { scope, scopeDiff } ) => {
          return (
            <MathBox mathbox={window.mathbox}>
              <Cartesian>
                <Grid axes='xy' />
                <Grid axes='yz' />
                {this.props.order.map(id => {
                  const data = this.evalData(id, mathGraphics[id], scope, setError)
                  return renderGraphic(id, data)
                } )
                }
              </Cartesian>
            </MathBox>
          )
        }}
      </MathScopeConsumer>
    )
  }

}

// TODO: this causes some unnecessary re-renders when tryEval returns an array
// that is double= but not triple=
function renderGraphic(id, data) {
  return (
    <Point
      key={id}
      coords={data.coords}
      size={20}
      color={data.color}
    />
  )
}
