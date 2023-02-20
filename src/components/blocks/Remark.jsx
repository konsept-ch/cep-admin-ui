import { Form } from 'react-bootstrap'

const Render = ({ text }) => (
    <Form.Group>
        <Form.Label>{text}</Form.Label>
        <Form.Control key={text} as="textarea" />
    </Form.Group>
)

const Editor = ({ type, text, onUpdate }) => (
    <>
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
                        text: e.target.value,
                    })
                }
            />
        </Form.Group>
    </>
)

export default {
    type: 'remark',
    label: 'Remark',
    default: {
        text: 'Texte par défaut',
    },
    Render,
    Editor,
}
