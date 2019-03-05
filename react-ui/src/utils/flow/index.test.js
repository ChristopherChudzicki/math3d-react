// @flow
import type { Optionalize, OptionalizeSome } from './index'

// NOTE: The jest describe/it functions are just for:
// 1. semantics, and
// 2. to keep declarations local.

describe('Optionalize', () => {
  it('Makes properties optional with inexact object', () => {
    type InexactObj = {
      a: number,
      b: string,
      c?: boolean
    }
    type TestObj = Optionalize<InexactObj>

    /* eslint-disable no-unused-vars */

    const good0: TestObj = { b: 'cat', c: false, d: [] }
    // $ExpectError 'b' is wrong type
    const bad0: TestObj = { b: 5, c: false, d: [] }

    /* eslint-enable no-unused-vars */

  } )

  it('Makes properties optional with exact object', () => {
    type ExactObj = {|
      a: number,
      b: string,
      c?: boolean
    |}
    type TestObj = Optionalize<ExactObj>

    /* eslint-disable no-unused-vars */

    const good: TestObj = { b: 'cat', c: false }
    // $ExpectError 'b' is wrong type
    const bad0: TestObj = { b: 5, c: false }
    // $ExpectError 'd' is extra
    const bad1: TestObj = { b: 'cat', c: false, d: 10 }

    /* eslint-enable no-unused-vars */

  } )
} )

describe('OptionalizeSome', () => {
  it('makes properties in second arg optional', () => {
    type Base = {|
      a: string,
      b: number,
      c?: boolean
    |}
    type ToBeOptional = {|
      b: number
    |}
    type Test = OptionalizeSome<Base, ToBeOptional>

    /* eslint-disable no-unused-vars */
    const good0: Test = { a: 'cat' }
    const good1: Test = { a: 'cat', b: 10 }
    const good2: Test = { a: 'cat', c: false }

    // $ExpectError 'a' is wrong type
    const bad0: Test = { a: 10 }
    // $ExpectError 'a' is required but missing
    const bad1: Test = { b: 10 }
    // $ExpectError type Test is exact but 'd' is extra
    const bad2: Test = { a: 'cat', b: 10, d: [] }
    /* eslint-enable no-unused-vars */

  } )
} )
