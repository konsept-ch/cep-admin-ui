import { Form } from 'react-bootstrap'

const Render = ({ identifier, text, onUpdate }) => (
    <Form.Group>
        <Form.Label
            className="text-break"
            dangerouslySetInnerHTML={{ __html: text.replaceAll('\n', '<br>') }}
        ></Form.Label>
        <Form.Control key="text" as="textarea" onChange={(e) => onUpdate(identifier, e.target.value)} />
    </Form.Group>
)

const Preview = ({ identifier, text }) => (
    <Form.Group>
        <Form.Label
            className="text-break"
            dangerouslySetInnerHTML={{ __html: text.replaceAll('\n', '<br>') }}
        ></Form.Label>
        <Form.Control key={text} as="textarea" />
    </Form.Group>
)

const Editor = ({ type, identifier, text, onUpdate }) => (
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
                        identifier,
                        text: e.target.value,
                    })
                }
            />
        </Form.Group>
    </>
)

export default {
    type: 'remark',
    label: 'Remarque',
    default: {
        identifier: '',
        required: true,
        text: 'Texte par défaut',
    },
    Render,
    Preview,
    Editor,
}
