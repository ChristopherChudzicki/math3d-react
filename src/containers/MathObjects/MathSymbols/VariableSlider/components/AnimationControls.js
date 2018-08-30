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
  animationMultiplier: number,
  fps: number,
  incrementByFraction: (fraction: number) => void,
  setProperty: (property: string, value: any) => void
}

export default class AnimationControls extends PureComponent<Props> {

  static defaultProps = {
    fps: 60,
    baseAnimationDuration: 4
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
            const value = (e.target.value === 'true')
            this.props.setProperty('isAnimating', !value)
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
            {this.props.animationMultiplier}
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
