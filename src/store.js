import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction'
import createSagaMiddleware from 'redux-saga'

import { rootReducer } from './reducers'
import { rootSaga } from './saga'

const sagaMiddleware = createSagaMiddleware()

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(sagaMiddleware)))

sagaMiddleware.run(rootSaga)
