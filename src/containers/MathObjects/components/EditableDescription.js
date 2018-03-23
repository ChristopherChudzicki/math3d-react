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
  padding-bottom: 0px;
  padding-top: 0px;
  padding-right:2px;
  padding-left:2px;
  border-bottom: 1px solid ${props => props.theme.medium};
  color: ${props => props.theme.dark};
  &:focus {
    outline-width:0px;
    border-bottom: 2px solid ${props => props.theme.primary};
    margin-bottom: -1px;
  }
`

export default class EditableDescription extends PureComponent {

  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
  }

  state = {
    width: '100%'
  }

  componentDidMount() {
    this.setWidth(this.props.value)
  }

  setWidth = text => {
    const textWidth = getTextWidth(text, '14px sans-serif')
    const paddingWidth = 4

    this.setState( {
      width: `${textWidth + paddingWidth}px`
    } )
  }

  onChange = e => {
    const text = e.target.value
    this.setWidth(text)
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
