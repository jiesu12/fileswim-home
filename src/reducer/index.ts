import { applyMiddleware, combineReducers, createStore, Store } from 'redux'
import thunk from 'redux-thunk'

const rootReducer = combineReducers({})

export type RootState = ReturnType<typeof rootReducer>

export const configureStore = (): Store => {
  const store = createStore(rootReducer, applyMiddleware(thunk))
  return store
}
