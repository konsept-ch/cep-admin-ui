import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction'
import createSagaMiddleware from 'redux-saga'

import { dataReducer } from './reducers/data'
import { rootSaga } from './saga/data'

const sagaMiddleware = createSagaMiddleware()

export const store = createStore(dataReducer, composeWithDevTools(applyMiddleware(sagaMiddleware)))

sagaMiddleware.run(rootSaga)
