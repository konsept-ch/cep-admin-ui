import { Form } from 'react-bootstrap'

const Render = ({ name, text, onUpdate }) => (
    <Form.Group>
        <Form.Label
            className="text-break"
            dangerouslySetInnerHTML={{ __html: text.replaceAll('\n', '<br>') }}
        ></Form.Label>
        <Form.Control key="text" as="textarea" onChange={(e) => onUpdate(name, e.target.value)} />
    </Form.Group>
)

const Preview = ({ name, text }) => (
    <Form.Group>
        <Form.Label
            className="text-break"
            dangerouslySetInnerHTML={{ __html: text.replaceAll('\n', '<br>') }}
        ></Form.Label>
        <Form.Control key={text} as="textarea" />
    </Form.Group>
)

const Editor = ({ type, name, text, onUpdate }) => (
    <>
        <Form.Group className="mb-3">
            <Form.Label>Nom</Form.Label>
            <Form.Control
                key="name"
                type="text"
                placeholder="Nom"
                defaultValue={name}
                onChange={(e) =>
                    onUpdate({
                        type,
                        name: e.target.value,
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
                        name,
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
        text: 'Texte par défaut',
    },
    Render,
    Preview,
    Editor,
}
