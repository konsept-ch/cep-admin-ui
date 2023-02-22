import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { HelmetProvider, Helmet } from 'react-helmet-async'
import { ToastContainer } from 'react-toastify'
import { Container } from 'react-bootstrap'

import { InscriptionsPage } from './pages/InscriptionsPage'
import { InscriptionsRefusedByHrPage } from './pages/InscriptionsRefusedByHrPage'
import { InscriptionCancellationsPage } from './pages/InscriptionCancellationsPage'
import { SurveyPage } from './pages/SurveyPage'
import { ContractsPage } from './pages/ContractsPage'
import { EvaluationsPage } from './pages/EvaluationsPage'
import { EvaluationPage } from './pages/EvaluationPage'
import { SessionsPage } from './pages/SessionsPage'
import { CoursesPage } from './pages/CoursesPage'
import { TemplatesPage } from './pages/TemplatesPage'
import { AttestationTemplatesPage } from './pages/AttestationTemplatesPage'
import { ContractTemplatesPage } from './pages/ContractTemplatesPage'
import { EvaluationTemplatesPage } from './pages/EvaluationTemplatesPage'
import { AgendaPage } from './pages/AgendaPage'
import { TypographyPage } from './pages/TypographyPage'
import { NotificationsPage } from './pages/NotificationsPage'
import { FormateursPage } from './pages/FormateursPage'
import { ErrorBoundary } from './pages/ErrorBoundaryPage'
import { OrganizationsPage } from './pages/OrganizationsPage'
import { UsersPage } from './pages/UsersPage'
import { InvoicePage } from './pages/InvoicePage'
import { InvoiceGroupedPage } from './pages/InvoiceGroupedPage'
import { ManualInvoicesPage } from './pages/ManualInvoicesPage'
import { SeancesPage } from './pages/SeancesPage'
import { Navigation } from './components'
import { Footer } from './components/Footer'
import {
    PATH_INSCRIPTIONS,
    PATH_SESSIONS,
    PATH_AGENDA,
    PATH_NOTIFICATIONS,
    PATH_FORMATIONS,
    PATH_TEMPLATES,
    PATH_EMAIL_TEMPLATES,
    PATH_ATTESTATION_TEMPLATES,
    PATH_CONTRACTS,
    PATH_EVALUATIONS,
    PATH_ORGANIZATIONS,
    PATH_FORMATEURS,
    PATH_USERS,
    PATH_CATALOGUE,
    PATH_COMMUNITY,
    PATH_INVOICE,
    PATH_INVOICE_DIRECT,
    PATH_INVOICE_GROUPED,
    PATH_INVOICE_MANUAL,
    PATH_ANNULATIONS,
    PATH_SEANCES,
    PATH_REFUSED_BY_HR,
} from './constants/constants'
import { AuthWrapper } from './AuthWrapper'
import { cookies } from './utils'

export function App() {
    const [isLoggedIn, setLoggedIn] = useState(cookies.get('isLoggedIn') === 'true')

    return (
        <>
            <ToastContainer />
            <Navigation {...{ isLoggedIn, setLoggedIn }} />
            <HelmetProvider>
                <Helmet>
                    <title>CEP - Former22</title>
                </Helmet>
                <ErrorBoundary>
                    <Routes>
                        <Route exact path={`/${PATH_EVALUATIONS}/:uuid`} element={<EvaluationPage />} />
                    </Routes>
                    <AuthWrapper {...{ isLoggedIn, setLoggedIn }}>
                        <Routes>
                            <Route
                                exact
                                path="/"
                                element={
                                    <Container fluid>
                                        <h1>Dashboard (en construction)</h1>
                                        <p>Notifications et alertes à venir</p>
                                    </Container>
                                }
                            />
                            <Route exact path={PATH_AGENDA} element={<AgendaPage />} />
                            <Route
                                exact
                                path={`${PATH_INSCRIPTIONS}/${PATH_INSCRIPTIONS}`}
                                element={<InscriptionsPage />}
                            />
                            <Route
                                exact
                                path={`${PATH_INSCRIPTIONS}/${PATH_FORMATEURS}`}
                                element={<FormateursPage />}
                            />
                            <Route
                                exact
                                path={`${PATH_INSCRIPTIONS}/${PATH_ANNULATIONS}`}
                                element={<InscriptionCancellationsPage />}
                            />
                            <Route
                                exact
                                path={`${PATH_INSCRIPTIONS}/${PATH_REFUSED_BY_HR}`}
                                element={<InscriptionsRefusedByHrPage />}
                            />
                            <Route exact path={`${PATH_CATALOGUE}/${PATH_FORMATIONS}`} element={<CoursesPage />} />
                            <Route exact path={`${PATH_CATALOGUE}/${PATH_SESSIONS}`} element={<SessionsPage />} />
                            <Route exact path={`${PATH_CATALOGUE}/${PATH_SEANCES}`} element={<SeancesPage />} />
                            <Route exact path={`${PATH_CATALOGUE}/${PATH_CONTRACTS}`} element={<ContractsPage />} />
                            <Route exact path={`${PATH_CATALOGUE}/${PATH_EVALUATIONS}`} element={<EvaluationsPage />} />
                            <Route
                                exact
                                path={`${PATH_TEMPLATES}/${PATH_EMAIL_TEMPLATES}`}
                                element={<TemplatesPage />}
                            />
                            <Route
                                exact
                                path={`${PATH_TEMPLATES}/${PATH_ATTESTATION_TEMPLATES}`}
                                element={<AttestationTemplatesPage />}
                            />
                            <Route
                                exact
                                path={`${PATH_TEMPLATES}/${PATH_CONTRACTS}`}
                                element={<ContractTemplatesPage />}
                            />
                            <Route
                                exact
                                path={`${PATH_TEMPLATES}/${PATH_EVALUATIONS}`}
                                element={<EvaluationTemplatesPage />}
                            />
                            <Route exact path={PATH_TEMPLATES} element={<TemplatesPage />} />
                            <Route exact path={`${PATH_COMMUNITY}/${PATH_USERS}`} element={<UsersPage />} />
                            <Route exact path={`${PATH_INVOICE}/${PATH_INVOICE_DIRECT}`} element={<InvoicePage />} />
                            <Route
                                exact
                                path={`${PATH_INVOICE}/${PATH_INVOICE_GROUPED}`}
                                element={<InvoiceGroupedPage />}
                            />
                            <Route
                                exact
                                path={`${PATH_INVOICE}/${PATH_INVOICE_MANUAL}`}
                                element={<ManualInvoicesPage />}
                            />
                            <Route
                                exact
                                path={`${PATH_COMMUNITY}/${PATH_ORGANIZATIONS}`}
                                element={<OrganizationsPage />}
                            />
                            <Route exact path={PATH_NOTIFICATIONS} element={<NotificationsPage />} />
                            <Route path="/survey/" element={<SurveyPage />} />
                            <Route path="/typography" element={<TypographyPage />} />
                        </Routes>
                    </AuthWrapper>
                </ErrorBoundary>
            </HelmetProvider>
            <Footer />
        </>
    )
}
