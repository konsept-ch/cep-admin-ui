import { Component } from 'react'

import { isDev, MIDDLEWARE_URL } from '../constants/config'
import { cookies } from '../utils'

export class ErrorBoundary extends Component {
    state = { error: undefined, errorInfo: undefined, hasError: false }

    static getDerivedStateFromError() {
        // Update state so the next render will show the fallback UI.
        return { hasError: true }
    }

    componentDidCatch(error, errorInfo) {
        // Catch errors in any components below and re-render with error message
        this.setState({
            error,
            errorInfo,
            // hasError: true,
        })
        // You can also log error messages to an error reporting service here
        console.error('Uncaught error:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            // const errorStack = 'test'
            const errorStack = (
                <pre className="error-boundary-stack">
                    {this.state.error?.toString()}

                    {this.state.errorInfo?.componentStack}
                </pre>
            )

            // Error path
            return (
                <div className="container-fluid my-3">
                    <h2>Il y a une erreur dans le code de l'application.</h2>
                    <p>L'erreur est probablement dans la couche de présentation.</p>
                    <p>Le système a fait une tentative de rapport automatique par e-mail.</p>
                    <p>
                        Vous êtes encouragés à envoyer le message d'erreur ci-dessous à l'administrateur technique par
                        e-mail et le problème sera résolu dans les plus bréfs délais:
                    </p>
                    <p>
                        <a
                            href={`mailto:info@konsept.ch?cc=info.cep@vd.ch&subject=Erreur&body=${encodeURIComponent(
                                `Bonjour

Nous avons observé l'erreur suivante (texte ci-dessous généré par l'application) :

${this.state.error}
${this.state.errorInfo?.componentStack}

Merci`
                            )}`}
                        >
                            info@konsept.ch
                        </a>
                    </p>
                    <p>
                        Pour recommencer, vous pouvez <a href={window.location.href}>rafraîchir la page</a> ou{' '}
                        <a href="/">retourner à la page d'accueil</a>
                        <br />
                        <br />
                    </p>
                    <div>{isDev ? errorStack : <details style={{ whiteSpace: 'pre-wrap' }}>{errorStack}</details>}</div>
                </div>
            )
        }
        // Normally, just render children
        return this.props.children
    }
}
