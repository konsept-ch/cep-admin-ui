import { Form } from 'react-bootstrap'

const Render = ({ text }) => <h1>{text}</h1>

const Editor = ({ type, text, onUpdate }) => (
    <>
        <Form.Group className="mb-3">
            <Form.Label>Texte</Form.Label>
            <Form.Control
                key={text}
                type="text"
                placeholder="Texte"
                defaultValue={text}
                onChange={(e) =>
                    onUpdate({
                        type,
                        text: e.target.value,
                    })
                }
            />
        </Form.Group>
    </>
)

export default {
    type: 'title',
    label: 'Titre',
    default: {
        text: 'Titre par défaut',
    },
    Render,
    Editor,
}
