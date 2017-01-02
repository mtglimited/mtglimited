import { createStore } from 'redux';
import DevTools from 'containers/DevTools';
import configureStore from './CreateStore';

jest.mock('redux', () => ({
  createStore: jest.fn(() => 'mockCreateStore'),
  compose: jest.fn(() => 'mockCompose'),
}));
jest.mock('containers/DevTools', () => ({
  instrument: jest.fn(() => 'mockInstrument'),
}));

describe('CreateStore', () => {
  describe('development mode', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
    });

    it('should instrument the DevTools', () => {
      const mockRootReducer = {};
      const store = configureStore(mockRootReducer);
      expect(DevTools.instrument).toHaveBeenCalled();
      expect(createStore).toHaveBeenCalledWith(mockRootReducer, 'mockCompose');
      expect(store).toBe('mockCreateStore');
    });
  });

  describe('production mode', () => {
    it('should create the store and return it', () => {
      const mockRootReducer = {};
      const store = createStore(mockRootReducer);
      expect(createStore).toHaveBeenCalled();
      expect(store).toBe('mockCreateStore');
    });
  });
});
