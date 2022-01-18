// @flow

type IntegratedCache = {
    [expr: string] : {
        isNumeric: bool,
        integratedFunction: Function
    } | {
        isNumeric: bool,
        step: number,
        integratedArray: Array<number>
    }
}
/**
* TODO:
* make an integrator class that can store cached function from mathjs-simple-integral or
* array of numbers from numerical integration.
* 
* then the cached function or array can be retrieved or created if not already exist
* by a function that recieve integral bounds, math, scope, and numerical integrate function 
* 
* 
* 
*/


export default class Integrator {
    _cache: IntegratedCache
}