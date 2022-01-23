// @flow

import type { Node } from 'utils/mathjs/types'

type IntegratedCacheSimple = {|
    isNumeric: bool,
    integratedFunction: Function    
|}

type IntegratedCacheNumeric = {|
    isNumeric: bool,
    step: number,
    lowerBound: number,
    upperBound: number,
    integratedArray: Array<number>
|}

type IntegratedCache = IntegratedCacheNumeric | IntegratedCacheSimple

type IntegratedCaches = {
    [name: string] : IntegratedCache
}

/**
* Integrator class that can store cached function from mathjs-simple-integral or
* array of numbers from numerical integration.
* 
* then the cached function or array can be retrieved or created if not already exist
* by a function that recieve integral bounds, math, scope, and numerical integrate function 
* AFAIK DONE!!
* tho I didn't find a way to cache integral bounds, they only take about 0.1 sec per compilation
* finding a way to cache integral bounds is especially hard when it comes to variable bounds.
*/

const STEP = 0.001

export default class Integrator {

    _cache: IntegratedCaches = {}

    getInt(expr: Node, lowerBound: number, upperBound: number, variable: string, math: Object, scope: Object, numericalIntegrator: Function) {

        // the name of caches use both expression and variable, because both of them can change the undetermined integral
        const name = `${expr.toString()} d${variable}`
        
        if (this._cache[name] === undefined) {
            this.addToCache(expr, lowerBound, upperBound, variable, math, scope, numericalIntegrator)
        }

        // if the cached function is a numeric function (an array)
        if (this._cache[name].isNumeric) {

            let cached: IntegratedCacheNumeric = this._cache[name]

            // if the boundaries are wider than current one, expand the cached array
            if (Math.max(lowerBound, upperBound) > cached.upperBound || Math.min(lowerBound, upperBound) < cached.lowerBound) {

                this.expandNumericInt(expr, lowerBound, upperBound, variable, scope, numericalIntegrator)
            }

            else {

                // update cached variable after expanded
                cached = this._cache[name]

                const lowerIndex = Math.floor(( lowerBound - cached.lowerBound ) / cached.step)
                const upperIndex = Math.floor(( upperBound - cached.lowerBound ) / cached.step)

                return cached.integratedArray[upperIndex] - cached.integratedArray[lowerIndex]

            }

        }

        // else, use the function that have been integrated by mathjs-simple-integral
        else {

            const { integratedFunction } = this._cache[name]

            return integratedFunction(lowerBound, upperBound)

        }

    }

    addToCache(expr: Node, lowerBound: number, upperBound: number, variable: string, math: Object, scope: Object, numericalIntegrator: Function) {
        
        // make copy of the scope to be modified
        let fnScope = Object.create(scope)
        const name = `${expr.toString()} d${variable.toString()}`

        try {
            // try to integrate using mathjs-simple-integral
            const integrated = math.integral(expr, variable).compile()

            // if successful make a new function from the integrated expression
            const _F = function (x) {
                fnScope[variable] = x
                return integrated.eval(fnScope)
            }

            const F = function (start, end) {
                return _F(end) - _F(start)
            }

            this._cache[name] = {
                isNumeric: false,
                integratedFunction: F

            }
        } catch (error) {

            // if fails, use numerical integration

            // construct a function which evaluates the first parameter f after applying
            // a value for parameter x.
            const fnCode = expr.compile()
            const f = function (x) {
                fnScope[variable] = x
                return fnCode.eval(fnScope)
            }

            // execute the integration and get the integrated array, with expanded upper bound
            const absoluteUpper = Math.max(lowerBound, upperBound)
            const absoluteLower = Math.min(lowerBound, upperBound)
            const integrated = numericalIntegrator(f, absoluteLower, absoluteUpper + 1, STEP)

            this._cache[name] = {
                isNumeric: true,
                step: STEP,
                lowerBound: absoluteLower,
                upperBound: STEP * Math.ceil((absoluteUpper + 1) / STEP),
                integratedArray: integrated
            }

        }

    }

    expandNumericInt(expr: Node, lowerBound: number, upperBound: number, variable: string, scope: Object, numericalIntegrator: Function) {
        // construct a function which evaluates the first parameter f after applying
        // a value for parameter x.
        const name = `${expr.toString()} d${variable.toString()}`
        const absoluteUpper = Math.max(lowerBound, upperBound)
        const absoluteLower = Math.min(lowerBound, upperBound)

        let fnScope = Object.create(scope)

        const fnCode = expr.compile()
        const f = function (x) {
            fnScope[variable] = x
            return fnCode.eval(fnScope)
        }

        let currentArray = this._cache[name].integratedArray

        // check the need for expansion directions
        const needUpward = absoluteUpper > this._cache[name].upperBound
        const needDownward = absoluteLower < this._cache[name].lowerBound

        // expand upward if needed
        if (needUpward) {
            let expandedUpper = numericalIntegrator(f, this._cache[name].upperBound, absoluteUpper + 1, STEP)
            const currentUpperValue = currentArray[currentArray.length - 1]
            expandedUpper = expandedUpper.map(value => value + currentUpperValue)
            expandedUpper.shift()
            currentArray.push(...expandedUpper)
        }

        // expand downward if needed
        if (needDownward) {
            const newLowerBound = this._cache[name].lowerBound - STEP * Math.ceil((this._cache[name].lowerBound - (absoluteLower - 1)) / STEP)
            let expandedLower = numericalIntegrator(f, newLowerBound, this._cache[name].lowerBound, STEP)
            const newLowerValue = expandedLower[expandedLower.length - 1]
            currentArray = currentArray.map(value => value + newLowerValue)
            currentArray.shift()
            currentArray = [...expandedLower, ...currentArray]
        }

        //get new boundaries
        const newLowerBound = needDownward? this._cache[name].lowerBound - STEP * Math.ceil((this._cache[name].lowerBound - (absoluteLower - 1)) / STEP) : this._cache[name].lowerBound
        const newUpperBound = needUpward? STEP * Math.ceil((absoluteUpper + 1) / STEP) : this._cache[name].upperBound

        this._cache[name] = {
            isNumeric: true,
            step: STEP,
            lowerBound: newLowerBound,
            upperBound: newUpperBound,
            integratedArray: currentArray
        }

    }
}