// @flow
class SequentialIdGenerator {

  _lastId = 0

  next() {
    this._lastId += 1
    return String(this._lastId)
  }

  setNextId(id: number) {
    this._lastId = id - 1
  }

}

const idGenerator = new SequentialIdGenerator()

export default idGenerator
