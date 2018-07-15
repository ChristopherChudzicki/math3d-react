import {
  isAssignmentRHS,
  isAssignmentLHS,
  isValidName,
  isNumeric
} from './validators'
import { Parser } from 'utils/mathParsing'

describe('isAssignmentRHS', () => {
  it('accepts valid right-hand-side of assignments', () => {
    const parser = new Parser()
    const result = isAssignmentRHS(parser, 'f\\left(x\\right)+4a')
    expect(result).toEqual( { isValid: true } )
  } )

  it('rejects expressions that mathJS cannot parse', () => {
    const parser = new Parser()
    const result = isAssignmentRHS(parser, 'f\\left(x\\right)+')
    expect(result).toEqual( {
      errorMsg: 'Parse Error: Unexpected end of expression',
      isValid: false
    } )
  } )

  it('rejects assignment expressions', () => {
    const parser = new Parser()
    const result = isAssignmentRHS(parser, 'f\\left(x\\right) = 5')
    expect(result).toEqual( {
      errorMsg: 'Parse Error: Unexpected assignment',
      isValid: false
    } )
  } )

  it('rejects empty and whitespace-only expressions', () => {
    const parser = new Parser()
    const result1 = isAssignmentRHS(parser, '')
    expect(result1).toEqual( {
      errorMsg: 'Parse Error: Unexpected end of expression',
      isValid: false
    } )

    const result2 = isAssignmentRHS(parser, '    ')
    expect(result2).toEqual( {
      errorMsg: 'Parse Error: Unexpected end of expression',
      isValid: false
    } )
  } )

} )

describe('isAssignmentLHS', () => {
  test('accepts valid left-hand-side of assignments', () => {
    const parser = new Parser()
    expect(isAssignmentLHS(parser, 'f(x)')).toEqual( { isValid: true } )
    expect(isAssignmentLHS(parser, 'a_1')).toEqual( { isValid: true } )
  } )

  test('rejects expressions that mathJS cannot parse', () => {
    const parser = new Parser()
    expect(isAssignmentLHS(parser, 'f\\left(x')).toEqual( {
      isValid: false,
      errorMsg: 'Parse Error: Parenthesis ) expected'
    } )
  } )

  test('rejects expressions that are not valid assignment left-hand-side', () => {
    const parser = new Parser()
    expect(isAssignmentLHS(parser, 'a+b')).toEqual( {
      isValid: false,
      errorMsg: 'Parse Error: Invalid left hand side of assignment operator ='
    } )
  } )

  test('edge cases with relational operators', () => {
    const parser = new Parser()
    const result = isAssignmentLHS(parser, 'a=')
    expect(result).toEqual( {
      isValid: false,
      errorMsg: 'Parse Error: Function equal missing in provided namespace "math"'
    } )
  } )

} )

describe('isNameValid', () => {
  test('accepts expressions with unused names', () => {
    const usedNames = new Set( ['a', 'f', 'g'] )
    const parser = new Parser()
    const result = isValidName(parser, 'h\\left(x,y\\right)', { usedNames } )
    expect(result).toEqual( { isValid: true } )
  } )

  test('rejects expressions with already used names', () => {
    const usedNames = new Set( ['a', 'f', 'g'] )
    const parser = new Parser()
    const result = isValidName(parser, 'g\\left(x,y\\right)', { usedNames } )
    expect(result).toEqual( {
      isValid: false,
      errorMsg: "Name Error: name 'g' is used more than once."
    } )
  } )
} )

describe('isNumeric', () => {
  it('should mark numbers as valid', () => {
    const parser = null
    expect(isNumeric(parser, '4.3')).toEqual( { isValid: true } )
  } )

  it('should mark non-numbers as invalid', () => {
    const parser = null
    expect(isNumeric(parser, '4.3.1')).toEqual( {
      isValid: false,
      errorMsg: 'Value Error: 4.3.1 is not a plain number'
    } )
  } )
} )