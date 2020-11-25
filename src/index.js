import { StrictMode } from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import { App } from './App'
import { unregister } from './serviceWorker'
import 'ag-grid-enterprise'
import './scss/index.scss'

render(
    <StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </StrictMode>,
    document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
unregister()
