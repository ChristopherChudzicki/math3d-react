// @flow
import * as React from 'react'
import styled from 'styled-components'
// ant design also has an autosizing textarea, but I found it too hard to resize
import Textarea from 'react-textarea-autosize'
import { getTextWidth } from './getTextWidth'

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

type Props = {
  value: string,
  onChange: (text: string) => void,
  style?: Object,
  className?: Array<string>
}
type State = {
  width: string
}

export default class EditableDescription extends React.PureComponent<Props, State> {

  state = {
    width: '100%'
  }

  static getDerivedStateFromProps(props: Props) {
    return {
      width: EditableDescription.getWidthFromText(props.value)
    }
  }

  static getWidthFromText(text: string) {
    const textWidth = getTextWidth(text, '14px sans-serif')
    const paddingWidth = 4

    // Hack: Give a bit of extra width...
    // Phones/Table text width detection was not working.
    // Maybe a font issue?
    const extra = 10

    return `${textWidth + extra + paddingWidth}px`
  }

  onChange = (event: SyntheticMouseEvent<HTMLTextAreaElement>) => {
    const text: string = event.currentTarget.value

    this.props.onChange(text)
  }

  render() {
    return (
      <StyledTextarea
        rows={1}
        width={this.state.width}
        value={this.props.value}
        onChange={this.onChange}
        style={this.props.style}
        className={this.props.className}
      />
    )
  }

}
