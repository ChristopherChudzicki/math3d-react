import {
  isAssignmentRHS,
  isAssignmentLHS,
  isValidName,
  isNumeric
} from './validators'
import { Parser } from 'utils/mathParsing'
import { ParseErrorData } from 'services/errors'

describe('isAssignmentRHS', () => {
  it('accepts valid right-hand-side of assignments', () => {
    const parser = new Parser()
    const result = isAssignmentRHS(parser, 'f\\left(x\\right)+4a')
    expect(result).toEqual(new ParseErrorData(null))
  } )

  it('rejects expressions that mathJS cannot parse', () => {
    const parser = new Parser()
    const result = isAssignmentRHS(parser, 'f\\left(x\\right)+')
    expect(result).toEqual(
      new ParseErrorData('Parse Error: Unexpected end of expression')
    )
  } )

  it('rejects assignment expressions', () => {
    const parser = new Parser()
    const result = isAssignmentRHS(parser, 'f\\left(x\\right) = 5')
    expect(result).toEqual(
      new ParseErrorData('Parse Error: Unexpected assignment')
    )
  } )

  it('rejects empty and whitespace-only expressions', () => {
    const parser = new Parser()
    const result1 = isAssignmentRHS(parser, '')
    expect(result1).toEqual(
      new ParseErrorData('Parse Error: Unexpected end of expression')
    )

    const result2 = isAssignmentRHS(parser, '    ')
    expect(result2).toEqual(
      new ParseErrorData('Parse Error: Unexpected end of expression')
    )
  } )

} )

describe('isAssignmentLHS', () => {
  test('accepts valid left-hand-side of assignments', () => {
    const parser = new Parser()
    expect(isAssignmentLHS(parser, 'f(x)')).toEqual(new ParseErrorData(null))
    expect(isAssignmentLHS(parser, 'a_1')).toEqual(new ParseErrorData(null))
  } )

  test('rejects expressions that mathJS cannot parse', () => {
    const parser = new Parser()
    expect(isAssignmentLHS(parser, 'f\\left(x')).toEqual(
      new ParseErrorData('Parse Error: Parenthesis ) expected')
    )
  } )

  test('rejects expressions that are not valid assignment left-hand-side', () => {
    const parser = new Parser()
    expect(isAssignmentLHS(parser, 'a+b')).toEqual(
      new ParseErrorData('Parse Error: Invalid left hand side of assignment operator =')
    )
  } )

  test('edge cases with relational operators', () => {
    const parser = new Parser()
    const result = isAssignmentLHS(parser, 'a=')
    expect(result).toEqual(
      new ParseErrorData('Parse Error: Function equal missing in provided namespace "math"')
    )
  } )

} )

describe('isNameValid', () => {
  test('accepts expressions with unused names', () => {
    const usedNames = new Set( ['a', 'f', 'g'] )
    const parser = new Parser()
    const result = isValidName(parser, 'h\\left(x,y\\right)', { usedNames } )
    expect(result).toEqual(new ParseErrorData(null))
  } )

  test('rejects expressions with already used names', () => {
    const usedNames = new Set( ['a', 'f', 'g'] )
    const parser = new Parser()
    const result = isValidName(parser, 'g\\left(x,y\\right)', { usedNames } )
    expect(result).toEqual(
      new ParseErrorData("Name Error: name 'g' is used more than once.")
    )
  } )
} )

describe('isNumeric', () => {
  it('should mark numbers as valid', () => {
    const parser = null
    expect(isNumeric(parser, '4.3')).toEqual(new ParseErrorData(null))
  } )

  it('should mark non-numbers as invalid', () => {
    const parser = null
    expect(isNumeric(parser, '4.3.1')).toEqual(
      new ParseErrorData('Value Error: 4.3.1 is not a plain number')
    )
  } )
} )
