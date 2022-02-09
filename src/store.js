import { createStore, applyMiddleware } from 'redux'
import { composeWithDevToolsLogOnlyInProduction } from '@redux-devtools/extension'
import createSagaMiddleware from 'redux-saga'

import { rootReducer } from './reducers'
import { rootSaga } from './saga'

const sagaMiddleware = createSagaMiddleware()

export const store = createStore(rootReducer, composeWithDevToolsLogOnlyInProduction(applyMiddleware(sagaMiddleware)))

sagaMiddleware.run(rootSaga)
