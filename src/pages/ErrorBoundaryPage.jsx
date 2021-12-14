import { Component } from 'react'
import { Helmet } from 'react-helmet-async'

export class ErrorBoundary extends Component {
    state = { error: null, errorInfo: null }

    componentDidCatch(error, errorInfo) {
        // Catch errors in any components below and re-render with error message
        this.setState({
            error,
            errorInfo,
        })
        // You can also log error messages to an error reporting service here
    }

    render() {
        if (this.state.errorInfo) {
            console.log(this.state.error, this.state.errorInfo)

            // Error path
            return (
                <>
                    <Helmet>
                        <title>Error - Former22</title>
                    </Helmet>
                    <div>
                        <h2>Il y a une erreur dans le code de l'application.</h2>
                        <p>L'erreur est probablement dans la couche de présentation.</p>
                        <p>Le système fera une tentative de rapport par e-mail.</p>
                        <p>
                            Vous êtes encouragés à envoyer le message d'erreur ci-dessous à l'administrateur technique
                            par e-mail et le problème sera résolu dans les plus bréfs délais:
                        </p>
                        <p>
                            <a
                                href={`mailto:info@konsept.ch?cc=info.cep@vd.ch&subject=Erreur&body=${encodeURIComponent(
                                    `Bonjour

Nous avons observé l'erreur suivante (texte ci-dessous généré par l'application) :

${this.state.error}
${this.state.errorInfo.componentStack}

Merci`
                                )}`}
                            >
                                info@konsept.ch
                            </a>
                        </p>
                        <p>
                            Pour recommencer, vous pouvez{' '}
                            <a href="/" onClick={window.location.reload}>
                                rafraîchir la page
                            </a>{' '}
                            ou <a href="/">retourner à la page d'accueil</a>
                        </p>
                        <pre>
                            {this.state.error && this.state.error.toString()}
                            <br />
                            {this.state.errorInfo.componentStack}
                        </pre>
                        <details style={{ whiteSpace: 'pre-wrap' }}></details>
                    </div>
                </>
            )
        }
        // Normally, just render children
        return this.props.children
    }
}
