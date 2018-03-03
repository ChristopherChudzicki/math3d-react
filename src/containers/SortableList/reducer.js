const initialState = [
  {
    id: 'A',
    children: ['A0', 'A1', 'A2', 'A3']
  },
  {
    id: 'B',
    children: ['B0', 'B1', 'B2', 'B3']
  },
  {
    id: 'C',
    children: ['C0', 'C1', 'C2', 'C3']
  },
  {
    id: 'D',
    children: ['D0', 'D1', 'D2', 'D3']
  }
]

export default (state = initialState, { type, payload } ) => {
  switch (type) {

    default:
      return state

  }
}
