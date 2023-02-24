import { Form } from 'react-bootstrap'

const Render = ({ text }) => <h1 className="text-break">{text}</h1>

const Preview = ({ text }) => <h1 className="text-break">{text}</h1>

const Editor = ({ type, identifier, text, onUpdate }) => (
    <>
        <Form.Group className="mb-3">
            <Form.Label>Texte</Form.Label>
            <Form.Control
                key="text"
                type="text"
                placeholder="Texte"
                defaultValue={text}
                onChange={(e) =>
                    onUpdate({
                        type,
                        identifier,
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
        identifier: '',
        required: false,
        text: 'Titre par défaut',
    },
    Render,
    Preview,
    Editor,
}
