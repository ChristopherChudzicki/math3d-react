// @flow
import React from 'react'
import EditableDescription from 'components/EditableDescription'
import { setTitle } from 'services/metadata/actions'
import { connect } from 'react-redux'
import styled from 'styled-components'

const StyledInput = styled(EditableDescription)`
  background-color: rgba(0, 0, 0, 0);
  margin-left:8px;
  font-weight:bold;
  padding-top:4px;
`

type OwnProps = {||}
type StateProps = {|
  title: string
|}
type DispatchProps = {|
  setTitle: (title: string) => void
|}
type Props = {|
  ...OwnProps,
  ...StateProps,
  ...DispatchProps
|}

function _TitleInput(props: Props) {
  return (
    <StyledInput
      value={props.title}
      onChange={props.setTitle}
    />
  )
}

const mapStateToProps = ( { metadata } ) => ( {
  title: metadata.title
} )

const mapDispatchToProps = { setTitle }

export default connect<Props, OwnProps, _, _, _, _>(mapStateToProps, mapDispatchToProps)(_TitleInput)
