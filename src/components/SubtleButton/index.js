import React, { PureComponent } from 'react'
import styled, { css } from 'styled-components'
import { lighten } from 'theme'
import PropTypes from 'prop-types'

const SubtleButtonInner = styled.button`
  border: none;
  border-radius: ${props => props.theme.borderRadius};
  transition-duration: ${props => props.theme.transitionDuration};
  transition-timing-function: ${props => props.theme.transitionTimingFunction};
  transition-property: all;
  background-color: ${props => props.backgroundColor};
  &:focus {
    outline: none;
    color: ${props => props.focusColor || props.theme.primary};
  };
  /* by default, button darkens on hover*/
  &:hover {
    background-color: rgba(0,0,0,0.10);
    font-weight:900;
    ${props => props.pressing && css`
      background-color: rgba(0,0,0,0.20);
      transition-duration: 0.1s;
      transform: translateY(1px);
    `};
  };
  /* if lightenOnHover, then lighten background on hover */
  ${props => props.lightenOnHover && css`
    background-color: ${props => props.backgroundColor || 'rgba(0,0,0,0)'};
    &:hover {
      background-color: ${props => lighten(props.backgroundColor, 0.75)};
      ${props => props.pressing && css`
        background-color: ${props => lighten(props.backgroundColor, 1)};
        transition-duration: 0.1s;
      `};
    };
  `}
`

/**
  * A 'subtle' button component.
  * - no border
  * - transparent by default, increased opacity on lightenOnHover
  * - if lightenOnHover=true AND backgroundColor supplied, then backgroundColor
  *   is lightened on hover instead.
 */

export default class SubtleButton extends PureComponent {

  static propTypes = {
    lightenOnHover: PropTypes.bool.isRequired,
    backgroundColor: PropTypes.string.isRequired,
    focusColor: PropTypes.string
  }

  static defaultProps = {
    lightenOnHover: false,
    backgroundColor: 'rgba(0,0,0,0)'
  }

  state = {
    pressing: false
  }

  getRef = ref => {
    this.button = ref
  }

  endPress = () => {
    this.setState( { pressing: false } )
  }

  beginPress = () => {
    // button focus triggers unreliably, so force it
    this.button.focus()
    this.setState( { pressing: true } )
  }

  render() {
    const {
      lightenOnHover,
      backgroundColor,
      focusColor,
      ...otherProps } = this.props

    if (lightenOnHover && !backgroundColor) {
      throw Error('lightenOnHover requires backgroundColor to be specified.')
    }

    return (
      // The only purpose of outer div is to capture press events
      <div
        onMouseDown={this.beginPress}
        onMouseUp={this.endPress}
        onMouseLeave={this.endPress}
      >
        <SubtleButtonInner
          lightenOnHover={lightenOnHover}
          backgroundColor={backgroundColor}
          focusColor={focusColor}
          innerRef={this.getRef}
          pressing={this.state.pressing}
          {...otherProps}
        />
      </div>
    )
  }

}
