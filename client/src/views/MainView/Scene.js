import React, { PureComponent } from "react";
import MathBoxContainer from "containers/MathBoxContainer";
import MathBoxScene from "containers/MathBoxScene";
import styled from "styled-components";

const SceneBoundary = styled.div`
  display: flex;
  height: 100%;
  overflow: hidden;
  flex: 1;
`;

const mathboxElement = document.getElementById("mathbox");

export default class Math3dScene extends PureComponent {
  render() {
    return (
      <SceneBoundary>
        <MathBoxContainer mathboxElement={mathboxElement}>
          <MathBoxScene />
        </MathBoxContainer>
      </SceneBoundary>
    );
  }
}
