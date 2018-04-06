import React, { PureComponent } from 'react'
import styled, { css } from 'styled-components'
import { lighten } from 'theme'
import PropTypes from 'prop-types'

/**
 * Parent container for SubtleButton. Its purpose is to filter which props are
 * handed to the button component. (React gets mad if unexpected properties are
 * passed to HTML elements.
 */

const SubtleButtonContainer = styled.div`
  & button {
    border: none;
    border-radius: ${props => props.theme.borderRadius};
    transition-duration: ${props => props.theme.transitionDuration};
    transition-timing-function: ${props => props.theme.transitionTimingFunction};
    transition-property: all;
  };
  & button, & button:focus {
    background-color: ${props => props.backgroundColor};
    outline: none;
  };
  & button:focus {
    color: ${props => props.focusColor || props.theme.primary};
  }
  /* by default, button darkens on hover*/
  & button:hover {
    background-color: rgba(0,0,0,0.10);
    font-weight:900;
  };
  & button:hover.sb-pressing {
    background-color: rgba(0,0,0,0.20);
    transition-duration: 0.1s;
    transform: translateY(1px);
  }
  /* if lightenOnHover, then lighten background on hover */
  ${props => props.lightenOnHover && css`
    & button {
      background-color: ${props => props.backgroundColor || 'rgba(0,0,0,0)'};
    }
    & button:hover {
      background-color: ${props => lighten(props.backgroundColor, 0.75)};
    };
    & button:hover.sb-pressing {
      background-color: ${props => lighten(props.backgroundColor, 1)};
      transition-duration: 0.1s;
    }
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
    backgroundColor: PropTypes.string,
    focusColor: PropTypes.string,
    className: PropTypes.string.isRequired,
    style: PropTypes.string
  }

  static defaultProps = {
    lightenOnHover: false,
    className: ''
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
      className,
      style,
      focusColor,
      ...otherProps } = this.props

    if (lightenOnHover && !backgroundColor) {
      throw Error('lightenOnHover requires backgroundColor to be specified.')
    }

    const fullClassName = `${className} ${this.state.pressing ? ' sb-pressing' : ''}`
    return (
      <SubtleButtonContainer
        lightenOnHover={lightenOnHover}
        backgroundColor={backgroundColor}
        focusColor={focusColor}
        onMouseDown={this.beginPress}
        onMouseUp={this.endPress}
        onMouseLeave={this.endPress}
      >
        <button
          ref={this.getRef}
          className={fullClassName}
          style={style}
          {...otherProps}
        />
      </SubtleButtonContainer>
    )
  }

}
