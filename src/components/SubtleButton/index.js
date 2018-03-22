import React from 'react'
import styled, { css } from 'styled-components'
import { lighten } from 'theme'
import PropTypes from 'prop-types'

/**
 * Parent container for SubtleButton. Its purpose is to filter which props are
 * handed to the button component. (React gets mad if unexpected properties are
 * passed to HTML elements.)
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
    background-color: ${props => props.backgroundColor}
  };
  /* by default, button darkens on hover*/
  & button:hover {
    background-color: rgba(0,0,0,0.10);
    font-weight:900;
  };
  /* if lightenOnHover, then lighten background on hover */
  ${props => props.lightenOnHover && css`
    & button {
      background-color: ${props => props.backgroundColor};
    }
    & button:hover {
      background-color: ${props => lighten(props.backgroundColor, 0.75)};
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

export default function SubtleButton(props) {
  const { lightenOnHover, backgroundColor, ...otherProps } = props

  if (lightenOnHover && !backgroundColor) {
    throw Error('lightenOnHover requires backgroundColor to be specified.')
  }

  return (
    <SubtleButtonContainer
      lightenOnHover={lightenOnHover}
      backgroundColor={backgroundColor}
    >
      <button {...otherProps}/>
    </SubtleButtonContainer>
  )
}

SubtleButton.propTypes = {
  lightenOnHover: PropTypes.bool.isRequired,
  backgroundColor: PropTypes.string.isRequired
}

SubtleButton.defaultProps = {
  lightenOnHover: false,
  backgroundColor: 'rgba(0,0,0,0)'
}
