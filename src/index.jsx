import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'ag-grid-enterprise'

import { store } from './store'
import { App } from './App'
// import { register } from './serviceWorker'
// import { reportWebVitals } from './reportWebVitals'
// import the third-party stylesheets directly from your JS
// import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css' // needs additional webpack config!
import './scss/index.scss'

// for UX only - normally handled on the server side
// if (window.location.protocol !== 'https:') {
//     window.location.replace(`https:${window.location.href.substring(window.location.protocol.length)}`)
// }

const container = document.getElementById('root')
const root = createRoot(container) // createRoot(container!) if you use TypeScript

root.render(
    <StrictMode>
        <Provider store={store}>
            <BrowserRouter basename={process.env.PUBLIC_URL}>
                <Routes>
                    <Route path="*" element={<App />} />
                </Routes>
            </BrowserRouter>
        </Provider>
    </StrictMode>
)

// If you want your app to work offline and load faster, you can
// uncomment register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// register()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log)
