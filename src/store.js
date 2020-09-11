import 'regenerator-runtime/runtime'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'
import dataReducer from './reducers/data'
import rootSaga from './saga/data'

const sagaMiddleware = createSagaMiddleware()

export default createStore(dataReducer, composeWithDevTools(applyMiddleware(sagaMiddleware)))

sagaMiddleware.run(rootSaga)
