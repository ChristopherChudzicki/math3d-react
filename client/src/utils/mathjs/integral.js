// @flow
import type { Node } from './types'

const STEP = 0.004

/**
 * Calculate the numeric integration of a function
 * @param {Function} f
 * @param {number} start
 * @param {number} end
 */
function integrate (f: Function, start: number, end: number) {
    let total = 0
    let sign = 1
    if (start > end) {
        const starttemp = start
        start = end
        end = starttemp
        sign = -1
    }

    for (let x = start; x < end; x += STEP) {
        total += STEP*(f(x) + 4*f(x + STEP / 2) + f(x + STEP))/6
    }
    return sign*total
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
 *            Expects the following arguments: [f, start, end, x]
 * @param {Object} math
 * @param {Object} [scope]
 */
integrate.transform = function (args, math, scope) {

    console.log(args)

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


    // create a new scope, linked to the provided scope. We use this new scope
    // to apply the variable.
    const fnScope = Object.create(scope)

    let F: Function
    // try to execute integral with mathjs-simple-integral
    try {        
        const integrated = math.integral(args[0], args[3]).compile()
        const _F = function (x) {
            fnScope[variable] = x
            return integrated.eval(fnScope)
        }

        F = function (start, end) {
            return _F(end) - _F(start)
        }
    }
    catch {
        // construct a function which evaluates the first parameter f after applying
        // a value for parameter x.
        const fnCode = args[0].compile()
        const f = function (x) {
            fnScope[variable] = x
            return fnCode.eval(fnScope)
        }

        // execute the integration
        F = function (start, end) {
            return integrate(f, start, end)
        }
    }

    return F(start, end)

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