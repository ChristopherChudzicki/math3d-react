// @flow
import type {
  HandledProps as GraphicHandledProps,
  Props as GraphicProps
} from 'components/MathBox/MathBoxComponents'
import type { Scope, Parser, Symbols } from 'utils/mathParsing'
import React, { PureComponent } from 'react'
import { MathBox, Grid, Cartesian } from 'components/MathBox'
import { MathScopeConsumer } from 'containers/MathScopeContext'
import { MathGraphics } from 'containers/MathObjects'
import PropTypes from 'prop-types'
import { parser } from 'constants/parsing'
import { EvalErrorData, RenderErrorData, setError } from 'services/errors'
type SetError = typeof setError

// TODO extract and test this
export function evalData(parser: Parser, data: Symbols, scope: Scope) {
  const initial = { evalErrors: {}, evaluated: {}, parseErrors: {} }
  return Object.keys(data).reduce((acc, prop) => {
    try {
      const parsed = parser.parse(data[prop] )
      try {
        acc.evaluated[prop] = parsed.eval(scope)
        return acc
      }
      catch (evalError) {
        acc.evalErrors[prop] = evalError
        return acc
      }
    }
    catch (parseError) {
      acc.parseErrors[prop] = parseError
      return acc
    }
<<<<<<< HEAD
  }, initial)
}

export function handleEvalErrors(
  id: string,
  newErrors: { [propName: string]: Error },
  existingErrors: { [propName: string]: string },
  setError: SetError
) {
  // Remove old errors
  Object.keys(existingErrors).forEach((prop) => {
    if (newErrors[prop]===undefined) {
      setError(id, prop, new EvalErrorData(null))
    }
  } )
  // Add new Errors
  Object.keys(newErrors).forEach((prop) => {
    const { message } = newErrors[prop]
    setError(id, prop, new EvalErrorData(message))
  } )
}
||||||| merged common ancestors
=======
  }, initial)
}

export function handleEvalErrors(
  id: string,
  newErrors: { [propName: string]: Error },
  existingErrors: { [propName: string]: string },
  setError: typeof SetError
) {
  // Remove old errors
  Object.keys(existingErrors).forEach((prop) => {
    if (newErrors[prop]===undefined) {
      setError(id, prop, new EvalErrorData(null))
    }
  } )
  // Add new Errors
  Object.keys(newErrors).forEach((prop) => {
    const { message } = newErrors[prop]
    setError(id, prop, new EvalErrorData(message))
  } )
}
>>>>>>> refactor evalData

export function filterObject(superObject: Object, keys: Array<string>) {
  return keys.reduce((acc, key) => {
    acc[key] = superObject[key]
    return acc
  }, {} )
}

<<<<<<< HEAD
type ErrorState = { [id: string]: { [propName: string]: string } }
type Props = {
  order: Array<string>,
  mathGraphics: { [id: string]: Object },
  evalErrors: ErrorState,
  renderErrors: ErrorState,
  setError: SetError
}
export default class MathBoxScene extends PureComponent<Props> {
||||||| merged common ancestors
export default class MathBoxScene extends PureComponent {
=======
type ErrorState = { [id: string]: { [propName: string]: string } }
type Props = {
  order: Array<string>,
  mathGraphics: { [id: string]: Object },
  evalErrors: ErrorState,
  renderErrors: ErrorState,
  setError: typeof setError
}
export default class MathBoxScene extends PureComponent<Props> {
>>>>>>> refactor evalData

  static propTypes = {
    order: PropTypes.array.isRequired,
    mathGraphics: PropTypes.object.isRequired,
    evalErrors: PropTypes.object.isRequired,
    renderErrors: PropTypes.object.isRequired,
    setError: PropTypes.func.isRequired
  }

  constructor(props: Props) {
    super(props)
    // $FlowFixMe
    this.handleRenderErrors = this.handleRenderErrors.bind(this)
  }

  handleRenderErrors(errors: ErrorState, graphicProps: GraphicProps, updatedProps: GraphicHandledProps) {
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
      .filter(prop => updatedProps[prop] ) // make sure the prop was updated
      .filter(prop => !errors[prop] ) // make sure updated prop does not have error
      .forEach(prop => { // clear the error
        setError(id, prop, new RenderErrorData())
      } )
  }

  // TODO: this causes some unnecessary re-renders when tryEval returns an array
  // that is double= but not triple=
  renderGraphic(id: string, data: Object) {
    const Graphic = MathGraphics[data.type].mathboxComponent
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
    const { mathGraphics, evalErrors, setError } = this.props
    return (
      <MathScopeConsumer>
        {( { scope, scopeDiff } ) => {
          return (
            <MathBox mathbox={window.mathbox}>
              <Cartesian id='rootCartesian'>
                {/* <Grid axes='xy' /> */}
                <Grid axes='yz' id='yz' />
                {this.props.order.map(id => {
                  const settings = mathGraphics[id]
                  const existingErrors = evalErrors[id]
                  const computedProps = MathGraphics[settings.type].computedProps
                  const toEvaluate = filterObject(settings, computedProps)
                  const {
                    evaluated,
                    evalErrors: newErrors
                  } = evalData(parser, toEvaluate, scope)
                  handleEvalErrors(id, newErrors, existingErrors, setError)
                  return this.renderGraphic(id, { ...settings, ...evaluated } )
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
