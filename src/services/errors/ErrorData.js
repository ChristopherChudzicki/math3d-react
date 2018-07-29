// @flow

export const PARSE_ERROR = 'PARSE_ERROR'
export const EVAL_ERROR = 'EVAL_ERROR'
export const RENDER_ERROR = 'RENDER_ERROR'

export class ErrorData {

  type : string
  errorMsg: ?string
  isError: boolean

  constructor(type: string, errorMsg: ?string) {
    this.type = type
    this.isError = errorMsg !== null && errorMsg !== undefined
    if (this.isError) {
      // do not set errorMsg at all if it's void.
      this.errorMsg = errorMsg
    }
  }

}

export class ParseErrorData extends ErrorData {

  constructor(errorMsg: string) {
    super(PARSE_ERROR, errorMsg)
  }

}

export class EvalErrorData extends ErrorData {

  constructor(errorMsg: string) {
    super(EVAL_ERROR, errorMsg)
  }

}

export class RenderErrorData extends ErrorData {

  constructor(errorMsg: string) {
    super(RENDER_ERROR, errorMsg)
  }

}
