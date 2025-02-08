import * as React from 'react'
import { connect } from 'react-redux'
import { getMathObjectProp } from './selectors'
import { StaticMathStyled } from './'
import { MathScopeConsumer } from '../../../../containers/MathScopeContext'
import { parser } from '../../../../constants/parsing'
import { evalData } from '../../../../services/evalData'
import math from '../../../../utils/mathjs'

/**
 * @module MathTextOutput defines a connected version of StaticMath for dynamic
 * latex text output
 */

class MathTextOutput extends React.PureComponent {

  constructor(props) {
    super(props)
    this.renderTextOutput = this.renderTextOutput.bind(this)
    this.convertExponentNotation = this.convertExponentNotation.bind(this)
    this.deepConvert = this.deepConvert.bind(this)
    this.convertComplexExponentNotation = this.convertComplexExponentNotation.bind(this)
  }

  render() {
    // scope consumer to get current scope
    return (
      <MathScopeConsumer>
        {this.renderTextOutput}
      </MathScopeConsumer>

    )
  }

  // convert exponent notation to latex
  // example: '123e+12' => '123 \cdot 10^{12}' 
  convertExponentNotation(number) {
    const string = Number.parseFloat(number).toPrecision(12)
    const index = string.search(/e[+-]/)
    if(index < 0){
      return Number(string)
    }
    const mantissa = Number(string.slice(0,index))
    const exponent = Number(string.slice(index+1))
    if(exponent < -12)
    return `${Number(mantissa)} \\cdot 10^{${exponent}}`
  }

  convertComplexExponentNotation(complex) {
      const real = this.convertExponentNotation(complex.re)
      const imag = this.convertExponentNotation(complex.im)
      const output = Math.abs(complex.re) < Math.abs(complex.im)/(10**12) ? `${imag}i` :
        Math.abs(complex.im) < Math.abs(complex.re)/(10**12)? `${real}` : 
        complex.im < 0 ? `${real}${imag}i` : `${real}+${imag}i`

      return output
  }

  // convert every member of an array to latex exponent
  // example: [2.3e+12,9.1e-10] => [2.3 \cdot 10^{12},9.1 \cdot 10^{-10}]
  deepConvert(array) {
    if(Array.isArray(array)){
      return array.map(element => {
        return this.deepConvert(element)
      });
    }

    if(array instanceof math.type.Complex) {
      const output = this.convertComplexExponentNotation(array)
      return output
    }
    return this.convertExponentNotation(array)
  }

  renderTextOutput({scope}) {
    const toBeEvaluated = {value: this.props.latex}
    const result = evalData(parser, toBeEvaluated, scope)
    const { evaluated } = result
    if(!evaluated.value) {
      return
    }

    const evaluatedValue = evaluated.value
    let outputText = ''

    if(Array.isArray(evaluatedValue)) {
      outputText = JSON.stringify(this.deepConvert(evaluatedValue)) //stringify will convert to literal string, so 
        .replace(/"/g,'')                                           //I have to replace double quotes and backslashes
        .replace(/\[/g,'\\left[')
        .replace(/]/g,'\\right]')
        .replace(/\\\\/g,'\\')
    }

    else if(evaluatedValue instanceof math.type.Complex) {
      outputText = this.convertComplexExponentNotation(evaluatedValue)
    }

    else {
      outputText = this.convertExponentNotation(evaluatedValue)
    }
    
    return (
      <StaticMathStyled
        latex={`=${outputText}`}
      />
    )
  }

}

//connect props to redux to get latex value for current math symbol/graphics
const mapStateToProps = ( { mathGraphics, mathSymbols}, ownProps) => {
  const { parentId, field } = ownProps
  const latex = getMathObjectProp( [mathGraphics, mathSymbols], parentId, field)
  return {
    latex
  }
}

export default connect(mapStateToProps)(MathTextOutput)