import classNames from 'classnames'
import { ListGroup } from 'react-bootstrap'

export const EvaluationModelItem = ({ isActive, uuid, title, description, onClick }) => (
    <ListGroup.Item
        key={uuid}
        onClick={onClick}
        className={classNames({
            'active-template': isActive,
        })}
    >
        <div className="d-flex align-items-start justify-content-between">
            <h4 className="d-inline-block">{title}</h4>
        </div>
        {description && <p>{description}</p>}
    </ListGroup.Item>
)
