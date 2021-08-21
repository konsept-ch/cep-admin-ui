import { StrictMode } from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { store } from './store'
import { App } from './App'
// import { register } from './serviceWorker'
// import { reportWebVitals } from './reportWebVitals'
import 'ag-grid-enterprise'
import './scss/index.scss'

render(
    <StrictMode>
        <Provider store={store}>
            <BrowserRouter basename={process.env.PUBLIC_URL}>
                <Switch>
                    <Route path="*">
                        <App />
                    </Route>
                </Switch>
            </BrowserRouter>
        </Provider>
    </StrictMode>,
    document.getElementById('root')
)

// If you want your app to work offline and load faster, you can
// uncomment register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// register()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log)
