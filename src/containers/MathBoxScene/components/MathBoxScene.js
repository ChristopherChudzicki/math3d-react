import React, { PureComponent } from 'react'
import { MathBox, Grid, Cartesian } from 'components/MathBox'
import { MathScopeConsumer } from 'containers/MathScopeContext'
import MathObjects from 'containers/MathObjects'
import PropTypes from 'prop-types'
import { parser } from 'constants/parsing'
import { EvalErrorData, RenderErrorData } from 'services/errors'

export default class MathBoxScene extends PureComponent {

  static propTypes = {
    order: PropTypes.array.isRequired,
    mathGraphics: PropTypes.object.isRequired,
    evalErrors: PropTypes.object.isRequired,
    renderErrors: PropTypes.object.isRequired,
    setError: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.handleRenderErrors = this.handleRenderErrors.bind(this)
  }

  evalData(id, data, scope) {
    const { setError, evalErrors } = this.props

    const computedProps = MathObjects[data.type].computedProps
    const evaluated = computedProps.reduce((acc, prop) => {
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

  handleRenderErrors(errors, graphicProps) {
    const id = graphicProps.id
    const setError = this.props.setError
    // dispatch errors
    Object.keys(errors)
      .forEach(prop => {
        const errorData = new RenderErrorData(errors[prop].message)
        setError(id, prop, errorData)
      } )
    // clear old errors if no longer present
    const oldErrors = this.props.renderErrors
    Object.keys(oldErrors[id] )
      .filter(prop => !errors[prop] )
      .forEach(prop => {
        setError(id, prop, new RenderErrorData())
      } )
  }

  // TODO: this causes some unnecessary re-renders when tryEval returns an array
  // that is double= but not triple=
  renderGraphic(id, data) {
    const Graphic = MathObjects[data.type].mathboxComponent
    return (
      <Graphic
        id={id}
        key={id}
        {...data}
        handleErrors={this.handleRenderErrors}
      />
    )
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
                  return this.renderGraphic(id, data)
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
