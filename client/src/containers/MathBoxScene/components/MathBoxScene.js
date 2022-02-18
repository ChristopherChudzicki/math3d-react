// @flow
import * as MB from "mathbox";

import type {
  HandledProps as GraphicHandledProps,
  ErrorMap,
} from "components/MathBox/MathBoxComponents";

import { Color } from "three/src/math/Color.js";
import { Vector3 } from "three/src/math/Vector3.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import React, { PureComponent } from "react";
import { MathBox, Cartesian } from "components/MathBox";
import { MathScopeConsumer } from "containers/MathScopeContext";
import { MathGraphics } from "containers/MathObjects";
import PropTypes from "prop-types";
import { parser } from "constants/parsing";
import { RenderErrorData, setError } from "services/errors";

import { evalData, handleEvalErrors, filterObject } from "services/evalData";
type SetError = typeof setError;

type ErrorState = {
  [id: string]: { [propName: string]: string },
};
type Props = {
  order: Array<string>,
  mathGraphics: { [id: string]: Object },
  evalErrors: ErrorState,
  renderErrors: ErrorState,
  setError: SetError,
};

export const mathbox = MB.mathBox({
  plugins: ["core", "controls", "cursor"],
  controls: {
    klass: OrbitControls,
  },
  element: document.getElementById("mathbox"),
  camera: {
    up: new Vector3(0, 0, 1),
  },
});

mathbox.three.camera.position.set(1, 1, 2);
mathbox.three.renderer.setClearColor(new Color(0xffffff), 1.0);

export default class MathBoxScene extends PureComponent<Props> {
  static propTypes = {
    order: PropTypes.array.isRequired,
    mathGraphics: PropTypes.object.isRequired,
    evalErrors: PropTypes.object.isRequired,
    renderErrors: PropTypes.object.isRequired,
    setError: PropTypes.func.isRequired,
  };

  constructor(props: Props) {
    super(props);
    // $FlowFixMe
    this.handleRenderErrors = this.handleRenderErrors.bind(this);
  }

  handleRenderErrors(
    errors: ErrorMap,
    id: string,
    updatedProps: GraphicHandledProps
  ) {
    const setError = this.props.setError;
    // dispatch new errors
    Object.keys(errors)
      // error[prop] === null represents errors that should be removed. We
      // deal with this case separately below so as not to dispatch error
      // removal unless the error previously existed
      .filter((prop) => errors[prop] !== null)
      .forEach((prop) => {
        // $FlowFixMe Flow is having trouble with object filter refinements
        const errMsg: string = errors[prop].message;
        setError(id, prop, new RenderErrorData(errMsg));
      });

    const oldErrors = this.props.renderErrors;
    // clear old errors that are no longer present
    Object.keys(oldErrors[id])
      .filter((prop) => updatedProps.hasOwnProperty(prop)) // make sure the prop was updated
      .filter((prop) => !errors.hasOwnProperty(prop)) // make sure updated prop does not have error
      .forEach((prop) => {
        // clear the error
        setError(id, prop, new RenderErrorData());
      });

    // clear old errors that were explicitly removed
    Object.keys(errors)
      .filter((prop) => oldErrors[id].hasOwnProperty(prop)) // prop previously had error
      .filter((prop) => errors[prop] === null) // prop no longer has error
      .forEach((prop) => {
        // clear the error
        setError(id, prop, new RenderErrorData());
      });
  }

  // TODO: this causes some unnecessary re-renders when tryEval returns an array
  // that is numerically equal but not triple=
  renderGraphic(id: string, data: Object) {
    const Graphic = MathGraphics[data.type].mathboxComponent;

    // Fractional zOrder seems to behave strangely sometimes, hence *100
    const zOrder =
      typeof data.opacity === "number" ? (1 - data.opacity) * 100 : 0;
    return (
      <Graphic
        id={id}
        key={id}
        zOrder={zOrder}
        {...data}
        handleErrors={this.handleRenderErrors}
      />
    );
  }

  render() {
    const { mathGraphics, evalErrors, setError } = this.props;
    return (
      <MathScopeConsumer>
        {({ scope, scopeDiff }) => {
          return (
            <MathBox mathbox={mathbox}>
              <Cartesian id="rootCartesian">
                {this.props.order.map((id) => {
                  const settings = mathGraphics[id];
                  const existingErrors = evalErrors[id];
                  const computedProps =
                    MathGraphics[settings.type].computedProps;
                  const toEvaluate = filterObject(settings, computedProps);
                  const { evaluated, evalErrors: newErrors } = evalData(
                    parser,
                    toEvaluate,
                    scope
                  );
                  handleEvalErrors(id, newErrors, existingErrors, setError);
                  return this.renderGraphic(id, { ...settings, ...evaluated });
                })}
              </Cartesian>
            </MathBox>
          );
        }}
      </MathScopeConsumer>
    );
  }
}
