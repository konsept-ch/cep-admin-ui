import { Form } from 'react-bootstrap'
import { v4 as uuidv4 } from 'uuid'

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

const Editor = ({ type, identifier, required, text, onUpdate }) => (
    <>
        <Form.Group className="mb-3">
            <Form.Check
                key="required"
                type="checkbox"
                label="Champ obligatoire"
                checked={required}
                onChange={(e) =>
                    onUpdate({
                        type,
                        identifier,
                        required: e.target.checked,
                        text,
                    })
                }
            />
        </Form.Group>
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
                        required,
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
    default: () => ({
        identifier: uuidv4(),
        required: true,
        text: 'Texte par défaut',
    }),
    Render,
    Preview,
    Editor,
}
