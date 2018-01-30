import _data from './data.js'

describe('api.data', () => {
  it('should return an object with a get and set function', () => {
    const state = {
      id: '1',
      data: {}
    }
    const data = _data(state)

    expect(data).toEqual(
      expect.objectContaining({
        get: expect.any(Function),
        set: expect.any(Function)
      })
    )
  })

  it('should create a data property on the state object if one does not exist', () => {
    const state = { id: '1' }
    const data = _data(state)

    expect(state.hasOwnProperty('data')).toBe(true)
  })

  describe('.get', () => {
    let state;
    let data;

    beforeEach(() => {
      state = {
        id: '1',
        data: {}
      }
      data = _data(state)
    })

    it('should throw an error if first parameter is not an array or a string', () => {
      expect(() => {
        data.get(5)
      }).toThrow()
    })

    it('should retrieve a value if passed a property name', () => {
      state.data.test = 'it works'
      expect(data.get('test')).toBe('it works')
    })

    it('should return undefined if passed a property that does not exist', () => {
      expect(data.get('nothing')).toBe(undefined)
    })

    it('should return multiple values as an array if given an array of keys', () => {
      state.data.one = '1'
      state.data.two = '2'
      state.data.three = 3
      expect(data.get(['one', 'two', 'three'])).toEqual(['1', '2', 3])
    })
  })

  describe('.set', () => {
    let state;
    let data;

    beforeEach(() => {
      state = {
        id: '1',
        data: {}
      }
      data = _data(state)
    })

    it('should throw an error if the first parameter is not a string or object', () => {
      expect(() => data.set(5)).toThrow()
    })

    it('should throw an error if given a second parameter when the first parameter is an object', () => {
      expect(() => data.set({ thing: 'val' }, 'I should not be here')).toThrow()
    })

    it('should set if given a name and a value', () => {
      data.set('this_is_a_test', 52)
      expect(state.data['this_is_a_test']).toBe(52)
    })

    it('should set multiple if given an object of keys and values', () => {
      data.set({
        one: 'fish',
        two: 'blue'
      })
      expect(state.data.one).toBe('fish')
      expect(state.data.two).toBe('blue')
    })

    it('should save values to localStorage when run', () => {
      const localData = _data({ id: '12345', data: {} })
      localData.set({ one: '1', two: 2 })

      expect(localStorage.__STORE__['widget_12345_data']).toBe('{"one":"1","two":2}')
    })
  })
})
