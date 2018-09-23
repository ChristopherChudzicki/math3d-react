// @flow
import type {
  HandledProps as GraphicHandledProps,
  Props as GraphicProps
} from 'components/MathBox/MathBoxComponents'
import React, { PureComponent } from 'react'
import { MathBox, Grid, Cartesian, Camera } from 'components/MathBox'
import { MathScopeConsumer } from 'containers/MathScopeContext'
import { MathGraphics } from 'containers/MathObjects'
import PropTypes from 'prop-types'
import { parser } from 'constants/parsing'
import { RenderErrorData, setError } from 'services/errors'
import {
  evalData,
  handleEvalErrors,
  filterObject
} from 'services/evalData'
type SetError = typeof setError

type ErrorState = { [id: string]: { [propName: string]: string } }
type Props = {
  order: Array<string>,
  mathGraphics: { [id: string]: Object },
  evalErrors: ErrorState,
  renderErrors: ErrorState,
  setError: SetError
}
export default class MathBoxScene extends PureComponent<Props> {

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
              <Camera id='camera'/>
              <Cartesian id='rootCartesian'>
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
