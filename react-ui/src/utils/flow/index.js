// @flow
export type ExtractReturn<Fn> = $Call<<T>((...Iterable<any>) => T) => T, Fn>;

// These two functions help in making default props optional
export type Optionalize<Obj> = $Rest<Obj, {}>
export type OptionalizeSome<Full, Opt> = {|...$Diff<Full, Opt>, ...Optionalize<Opt>|}
