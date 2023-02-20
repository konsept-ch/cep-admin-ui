import { Form } from 'react-bootstrap'

const Render = ({ identifier, text, min, max }) => (
    <div>
        <p>{text}</p>
        <div className="d-flex gap-2">
            {[...Array(max - min + 1).keys()].map((note) => (
                <Form.Check
                    key={note}
                    type="checkbox"
                    name={identifier}
                    id={`${identifier}-${note}`}
                    label={min + note}
                    disabled={false}
                />
            ))}
        </div>
    </div>
)

const Editor = ({ type, identifier, text, min, max, onUpdate }) => (
    <>
        <Form.Group className="mb-3">
            <Form.Label>Identifiant</Form.Label>
            <Form.Control
                key={identifier}
                type="text"
                placeholder="Identifiant"
                defaultValue={identifier}
                onChange={(e) =>
                    onUpdate({
                        type,
                        identifier: e.target.value,
                        text,
                        min,
                        max,
                    })
                }
            />
        </Form.Group>
        <Form.Group className="mb-3">
            <Form.Label>Texte</Form.Label>
            <Form.Control
                key={text}
                as="textarea"
                placeholder="Texte"
                defaultValue={text}
                onChange={(e) =>
                    onUpdate({
                        type,
                        identifier,
                        text: e.target.value,
                        min,
                        max,
                    })
                }
            />
        </Form.Group>
        <Form.Group className="mb-3">
            <Form.Label>Note minimum</Form.Label>
            <Form.Control
                key={min}
                type="number"
                placeholder="Note Minimum"
                defaultValue={min}
                onChange={(e) =>
                    onUpdate({
                        type,
                        identifier,
                        text,
                        min: parseInt(e.target.value),
                        max,
                    })
                }
            />
        </Form.Group>
        <Form.Group className="mb-3">
            <Form.Label>Note maximum</Form.Label>
            <Form.Control
                key={max}
                type="number"
                placeholder="Note maximum"
                defaultValue={max}
                onChange={(e) =>
                    onUpdate({
                        type,
                        identifier,
                        text,
                        min,
                        max: parseInt(e.target.value),
                    })
                }
            />
        </Form.Group>
    </>
)

export default {
    type: 'notes',
    label: 'Notes',
    default: {
        identifier: 'abc',
        text: 'Question par défaut',
        min: 1,
        max: 5,
    },
    Render,
    Editor,
}
