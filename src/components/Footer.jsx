import { useNavigate, useLocation } from 'react-router-dom'
import { Nav, Navbar } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileLines, faMessage } from '@fortawesome/free-regular-svg-icons'
import { PATH_NOTIFICATIONS } from '../constants/constants'

export const Footer = ({ isLoggedIn }) => {
    const navigate = useNavigate()
    const location = useLocation()

    const goTo = (to) => (event) => {
        event.preventDefault()
        navigate(to)
    }

    return (
        isLoggedIn && (
            <>
                <Navbar bg="light" expand="xl" className="mt-auto">
                    <Nav className="me-auto" />
                    <Nav activeKey={location.pathname}>
                        <Nav.Link>
                            <FontAwesomeIcon icon={faFileLines} /> Logs
                        </Nav.Link>
                        <Nav.Link href={PATH_NOTIFICATIONS} onClick={goTo(PATH_NOTIFICATIONS)}>
                            <FontAwesomeIcon icon={faMessage} /> Notifications
                        </Nav.Link>
                    </Nav>
                </Navbar>
                {/* <footer className="footer mt-auto py-3">
            <p>Ceci est du contenu dans le pied de page collant</p>
        </footer> */}
            </>
        )
    )
}
