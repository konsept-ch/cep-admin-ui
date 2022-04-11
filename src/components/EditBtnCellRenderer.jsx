import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/pro-light-svg-icons'

export const EditBtnCellRenderer =
    ({ onClick }) =>
    ({ data }) =>
        (
            <Button variant="primary" onClick={() => onClick({ data })} size="sm" className="edit-button-style">
                <FontAwesomeIcon icon={faPen} />
            </Button>
        )
