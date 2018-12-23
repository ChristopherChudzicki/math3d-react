// @flow
import * as React from 'react'
import styled from 'styled-components'
// ant design also has an autosizing textarea, but I found it too hard to resize
import Textarea from 'react-textarea-autosize'
import { getTextWidth } from './getTextWidth'

// NOTE: using maxwidth below instead of maxWidth because TextArea seems to
//  pass all of its props on textarea, which does does not recognize, hence
//  React throws a warning

const StyledTextarea = styled(Textarea)`
  width: ${props => props.width};
  max-width: ${props => props.maxwidth ? `${props.maxwidth}px` : '100%'};
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
  overflow:hidden;
`

type Props = {
  value: string,
  onChange: (text: string) => void,
  style?: Object,
  className?: Array<string>,
  maxwidth?: number
}
type State = {
  width: string
}

export default class EditableDescription extends React.PureComponent<Props, State> {

  getWidthFromText(text: string) {
    const font = '14px sans-serif'
    const paddedText = text + ' '
    const textWidth = getTextWidth(paddedText, font)
    const paddingWidth = 4
    // Hack: Give a bit of extra width...
    // Phones/Table text width detection was not working.
    // Maybe a font issue?
    const factor = 1.1
    const extra = 5
    return `${factor*textWidth + extra + paddingWidth}px`
  }

  onChange = (event: SyntheticMouseEvent<HTMLTextAreaElement>) => {
    const text: string = event.currentTarget.value
    this.props.onChange(text)
  }

  render() {
    const width = this.getWidthFromText(this.props.value)
    return (
      <StyledTextarea
        rows={1}
        width={width}
        maxwidth={this.props.maxwidth}
        value={this.props.value}
        onChange={this.onChange}
        style={this.props.style}
        className={this.props.className}
      />
    )
  }

}
