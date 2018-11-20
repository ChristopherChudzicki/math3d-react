// @flow
export type ExtractReturn<Fn> = $Call<<T>((...Iterable<any>) => T) => T, Fn>;
