// @flow
import type { Node } from './types'
import { Integrator } from './Integrator.js'

const integrator = new Integrator()

const STEP = 0.001


// Cash-Karp, Runge-Kutta Family of numerical integration method

const RKC = [0, 3 / 10, 3 / 5, 1, 7 / 8]
const RKB = [2825/27648, 18575/48384, 13525/55296, 277/14336, 1/4]

/**
 * Calculate the numeric integration of a function
 * @param {Function} f
 * @param {number} start
 * @param {number} end
 */
function integrate (f: Function, start: number, end: number, step?: number = STEP): Array<number> {

    let result = [0]
    let sign = 1

    if (start > end) {
        const starttemp = start
        start = end
        end = starttemp
        sign = -1
    }

    for (let x = start; x < end; x += step) {

        const intIndex = Math.round((x - start) / step)
        x = intIndex * step + start

        let dx = step * RKC.reduce((prevSum, currentCoef, index) => {
            return prevSum + RKB[index]*f(x + currentCoef*step)
        }, 0)

        dx = dx || 0
        
        result.push(result[intIndex] + dx)

    }

    result = result.map(value => sign * value)

    return result
}

/**
 * A transformation for the integrate function. This transformation will be
 * invoked when the function is used via the expression parser of math.js.
 *
 * from https://mathjs.org/examples/advanced/custom_argument_parsing.js.html 
 * with modifications
 *
 * Syntax:
 *
 *     integrate(integrand, start, end, variable)
 *
 * Usage:
 *
 *     math.evaluate('integrate(2*x, 0, 2, x)')
 *
 * @param {Array.<math.Node>} args
 *            Expects the following arguments: [expr, start, end, symbol]
 * @param {Object} math
 * @param {Object} [scope]
 */
integrate.transform = function (args, math, scope) {

    // determine the variable name
    if (!args[3].isSymbolNode) {
        throw new Error('Integrating variable must be a symbol')
    }
    const variable = args[3].name


    // check for integration bounds dependencies
    if (getDependencies(args[1]).has(variable) || getDependencies(args[2]).has(variable)) {
        throw Error(`Integration bounds can't depend on integration variable '${variable}'. `)
    }


    // evaluate start and end
    const start = args[1].compile().eval(scope)
    const end = args[2].compile().eval(scope)


    // pass to the integrator to create or retreve caches
    return integrator.getInt(args[0], start, end, variable, math, scope, integrate)

}

// mark the transform function with a "rawArgs" property, so it will be called
// with uncompiled, unevaluated arguments.
integrate.transform.rawArgs = true

export const int = { integrate: integrate }

const getDependencies = (expr: Node) => {
    const dependencies: Set<string> = new Set()

    expr.traverse((node: Node) => {
      if (node.type === 'SymbolNode' || node.type === 'FunctionNode') {
        dependencies.add(node.name)
      }
    } )

    return dependencies
}