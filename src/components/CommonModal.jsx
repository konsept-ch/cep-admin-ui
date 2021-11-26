import { Modal } from 'react-bootstrap'

export const CommonModal = ({ title, content, footer, isVisible, onHide }) => {
    return (
        <Modal show={isVisible} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{content}</Modal.Body>
            <Modal.Footer>{footer}</Modal.Footer>
        </Modal>
    )
}
