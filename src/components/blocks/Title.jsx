import { Form } from 'react-bootstrap'

const Render = ({ text, tag }) => {
    const Tag = tag
    return <Tag className="text-break">{text}</Tag>
}

const Preview = ({ text, tag }) => {
    const Tag = tag
    return <Tag className="text-break">{text}</Tag>
}

const Editor = ({ type, identifier, text, tag, onUpdate }) => (
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
                        tag,
                    })
                }
            />
        </Form.Group>
        <Form.Group className="mb-3">
            <Form.Label>Balise</Form.Label>
            <Form.Select
                value={tag}
                onChange={(e) =>
                    onUpdate({
                        type,
                        identifier,
                        text,
                        tag: e.target.value,
                    })
                }
            >
                <option value="h1">h1</option>
                <option value="h2">h2</option>
                <option value="h3">h3</option>
                <option value="h4">h4</option>
                <option value="h5">h5</option>
                <option value="h6">h6</option>
            </Form.Select>
        </Form.Group>
    </>
)

export default {
    type: 'title',
    label: 'Titre',
    default: () => ({
        text: 'Titre par défaut',
        tag: 'h1',
    }),
    Render,
    Preview,
    Editor,
}
