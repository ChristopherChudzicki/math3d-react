// @flow
import React, { PureComponent } from 'react'
import { Button, Icon } from 'antd'
import theme from 'constants/theme'
import styled from 'styled-components'

const AnimationControlsContainer = styled.div`
  display: flex;
  flex: 1;
  align-items:center;
  justify-content: space-around;
`

const AnimationButton = styled(Button)`
  border-color: ${props => props.theme.gray[2]};
  color: ${props => props.theme.gray[5]};
  display: flex;
  align-items: center;
  justify-content: center;
  & i {
    color: ${props => props.theme.gray[5]};
  }
`

const speedDisplay = { cursor: 'default' }

type Props = {
  isAnimating: bool,
  baseAnimationDuration: number,
  speedMultiplier: number,
  fps: number,
  incrementByFraction: (fraction: number) => void,
  setProperty: (property: string, value: any) => void
}

export default class AnimationControls extends PureComponent<Props> {

  _interval: IntervalID

  static defaultProps = {
    fps: 60,
    baseAnimationDuration: 4
  }

  constructor(props: Props) {
    super(props)
    // $FlowFixMe
    this.startAnimation = this.startAnimation.bind(this)
    // $FlowFixMe
    this.stopAnimation = this.stopAnimation.bind(this)
  }

  startAnimation() {
    this.props.setProperty('isAnimating', true)
    const { baseAnimationDuration, fps, speedMultiplier } = this.props
    const duration = baseAnimationDuration/speedMultiplier
    const delay = 1/fps
    const fractionalStepSize = delay/duration // inverse of numSteps = duration/delay
    const incrementByFraction = this.props.incrementByFraction
    console.log(baseAnimationDuration, fps, speedMultiplier, duration, delay, fractionalStepSize)
    this._interval = setInterval(
      () => incrementByFraction(fractionalStepSize),
      delay
    )
  }

  stopAnimation() {
    this.props.setProperty('isAnimating', false)
    clearInterval(this._interval)
  }

  render() {
    return (
      <AnimationControlsContainer>
        <AnimationButton
          shape='circle'
          size='small'
          value={this.props.isAnimating}
          onClick={e => {
            // e.target.value is a string, so convert to bool:
            if (e.target.value === 'false') {
              this.startAnimation()
            }
            else {
              this.stopAnimation()
            }
          } }
        >
          <Icon type={
            this.props.isAnimating
              ? 'pause'
              : 'caret-right'
          } />
        </AnimationButton>
        <Button.Group size='small'>
          <AnimationButton>
            <Icon type="backward" />
          </AnimationButton>
          <AnimationButton disabled={true} style={speedDisplay}>
            {this.props.speedMultiplier}
            <Icon type="close" style={ { fontSize: '75%' } } />
          </AnimationButton>
          <AnimationButton>
            <Icon type="forward" />
          </AnimationButton>
        </Button.Group>
        <Button.Group size='small'>
          <AnimationButton
            onClick={()=>this.props.incrementByFraction(-0.01)}
          >
            <Icon type="minus" />
          </AnimationButton>
          <AnimationButton
            onClick={()=>this.props.incrementByFraction(+0.01)}
          >
            <Icon type="plus" />
          </AnimationButton>
        </Button.Group>
      </AnimationControlsContainer>

    )
  }

}
