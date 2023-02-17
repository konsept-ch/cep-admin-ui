import { Form } from 'react-bootstrap'

const Render = ({ text }) => <p>{text}</p>

const Editor = ({ type, text, onUpdate }) => (
    <>
        <Form.Group className="mb-3">
            <Form.Label>Texte</Form.Label>
            <Form.Control
                as="textarea"
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
    type: 'paragraph',
    label: 'Paragraph',
    default: {
        text: 'Texte par défaut',
    },
    Render,
    Editor,
}
