// @flow
import type { Math } from './types'
import core from 'mathjs/core'
const math: Math = core.create()

math.import(require('mathjs/lib/type/matrix'))
math.import(require('mathjs/lib/type/complex'))
math.import(require('mathjs/lib/constants'))
math.import(require('mathjs/lib/function/arithmetic'))
math.import(require('mathjs/lib/function/trigonometry'))
math.import(require('mathjs/lib/function/matrix'))
math.import(require('mathjs/lib/function/statistics'))

math.import(require('mathjs/lib/expression'))

export default math
