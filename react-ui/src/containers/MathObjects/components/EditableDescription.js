import React, { PureComponent } from 'react'
import styled from 'styled-components'
// ant design also has an autosizing textarea, but I found it too hard to resize
import Textarea from 'react-textarea-autosize'
import PropTypes from 'prop-types'

const StyledTextarea = styled(Textarea)`
  width: ${props => props.width};
  max-width: calc(100% - 35px);
  resize: none;
  border-top:none;
  border-left: none;
  border-right:none;
  border-radius: 0px;
  padding-bottom: 1px; /*MO border was appearing too small. This fixed it. I do not understand ... */
  padding-top: 0px;
  padding-right:2px;
  padding-left:2px;
  border-bottom: 1px solid ${props => props.theme.gray[5]};
  color: ${props => props.theme.gray[6]};
  &:focus {
    outline: none;
    border-bottom: 2px solid ${props => props.theme.primary[4]};
  };
`

export default class EditableDescription extends PureComponent {

  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
  }

  state = {
    width: '100%'
  }

  static getDerivedStateFromProps(props) {
    return {
      width: EditableDescription.getWidthFromText(props.value)
    }
  }

  static getWidthFromText(text) {
    const textWidth = getTextWidth(text, '14px sans-serif')
    const paddingWidth = 4
    const extra = 10
    return `${textWidth + extra + paddingWidth}px`
  }

  onChange = e => {
    const text = e.target.value
    this.props.onChange(text)
  }

  render() {
    return (
      <StyledTextarea
        rows={1}
        width={this.state.width}
        value={this.props.value}
        onChange={this.onChange}
      />
    )
  }

}

function getTextWidth(text, font) {
  // from https://stackoverflow.com/a/21015393/2747370
  // re-use canvas object for better performance
  const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'))
  const context = canvas.getContext('2d')
  context.font = font
  const metrics = context.measureText(text)
  const roundedWidth = Math.floor(metrics.width) + 1
  return roundedWidth
}
