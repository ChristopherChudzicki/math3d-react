// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import { StaticMathStyled } from './components/MathQuillStyled'
import { getMathObjectProp } from './selectors'

type Props = React.ElementConfig<typeof StaticMathStyled>
type OwnProps = {|
  parentId: string,
  field: string
|}

const mapStateToProps = ( { mathSymbols, mathGraphics }, ownProps) => {
  const { parentId, field } = ownProps
  return {
    latex: getMathObjectProp( [mathGraphics, mathSymbols], parentId, field)
  }
}

export default connect<Props, OwnProps, _, _, _, _>(mapStateToProps)(StaticMathStyled)
