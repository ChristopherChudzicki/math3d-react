import {
  isAssignmentRHS,
  isAssignmentLHS,
  isValidName
} from './validators'
import { Parser } from 'utils/mathParsing'

describe('isAssignmentRHS', () => {
  test('accepts valid right-hand-side of assignments', () => {
    const parser = new Parser()
    const result = isAssignmentRHS(parser, 'f\\left(x\\right)+4a')
    expect(result).toEqual( { isValid: true } )
  } )

  test('rejects expressions that mathJS cannot parse', () => {
    const parser = new Parser()
    const result = isAssignmentRHS(parser, 'f\\left(x\\right)+')
    expect(result).toEqual( {
      errorMsg: 'Parse Error: Unexpected end of expression (char 6)',
      isValid: false
    } )
  } )

  test('rejects assignment expressions', () => {
    const parser = new Parser()
    const result = isAssignmentRHS(parser, 'f\\left(x\\right) = 5')
    expect(result).toEqual( {
      errorMsg: 'Parse Error: Unexpected assignment',
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
      errorMsg: 'Parse Error: Parenthesis ) expected (char 6)'
    } )
  } )

  test('rejects expressions that are not valid assignment left-hand-side', () => {
    const parser = new Parser()
    expect(isAssignmentLHS(parser, 'a+b')).toEqual( {
      isValid: false,
      errorMsg: 'Parse Error: Invalid left hand side of assignment operator = (char 4)'
    } )
  } )

  test('edge cases with ordering operators', () => {
    const parser = new Parser()
    const result = isAssignmentLHS(parser, 'a=')
    expect(result).toEqual( {
      isValid: false,
      errorMsg: 'Parse Error: invalid symbol name.'
    } )
  } )

} )

describe('isNameValid', () => {
  test('accepts expressions with unused names', () => {
    const usedNames = new Set( ['a', 'f', 'g'] )
    const parser = new Parser()
    const result = isValidName(usedNames, parser, 'h\\left(x,y\\right)')
    expect(result).toEqual( { isValid: true } )
  } )

  test('rejects expressions with already used names', () => {
    const usedNames = new Set( ['a', 'f', 'g'] )
    const parser = new Parser()
    const result = isValidName(usedNames, parser, 'g\\left(x,y\\right)')
    expect(result).toEqual( {
      isValid: false,
      errorMsg: "Name Error: name 'g' is used more than once."
    } )
  } )
} )
