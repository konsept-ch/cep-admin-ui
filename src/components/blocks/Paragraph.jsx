import { Form } from 'react-bootstrap'

const Render = ({ text }) => (
    <p className="text-break" dangerouslySetInnerHTML={{ __html: text.replaceAll('\n', '<br>') }}></p>
)

const Preview = ({ text }) => (
    <p className="text-break" dangerouslySetInnerHTML={{ __html: text.replaceAll('\n', '<br>') }}></p>
)

const Editor = ({ type, text, onUpdate }) => (
    <>
        <Form.Group className="mb-3">
            <Form.Label>Texte</Form.Label>
            <Form.Control
                key="text"
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
        identifier: '',
        required: false,
        text: 'Texte par défaut',
    },
    Render,
    Preview,
    Editor,
}
