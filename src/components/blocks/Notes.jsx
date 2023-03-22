import { Form, Button, InputGroup } from 'react-bootstrap'
import { v4 as uuidv4 } from 'uuid'

const Render = ({ identifier, text, notes, onUpdate }) => {
    return (
        <>
            <p className="text-break" dangerouslySetInnerHTML={{ __html: text.replaceAll('\n', '<br>') }}></p>
            <div className="d-flex flex-column gap-2">
                {notes.map((note, index) => (
                    <Form.Check
                        key={index}
                        type="radio"
                        name={identifier}
                        label={note}
                        value={note}
                        onChange={(e) => onUpdate(identifier, e.target.value)}
                    />
                ))}
            </div>
        </>
    )
}

const Preview = ({ identifier, text, notes }) => {
    return (
        <>
            <p className="text-break" dangerouslySetInnerHTML={{ __html: text.replaceAll('\n', '<br>') }}></p>
            <div className="d-flex flex-column gap-2">
                {notes.map((note, index) => (
                    <Form.Check key={index} type="radio" name={identifier} label={note} />
                ))}
            </div>
        </>
    )
}

const Editor = ({ type, identifier, required, text, notes, onUpdate }) => {
    const onAddNote = () => {
        onUpdate({
            type,
            identifier,
            text,
            notes: [...notes, `${notes.length + 1}`],
        })
    }

    const onRemoveNote = (index) => {
        onUpdate({
            type,
            identifier,
            text,
            notes: [...notes.slice(0, index), ...notes.slice(index + 1)],
        })
    }

    return (
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
                            notes,
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
                            notes,
                        })
                    }
                />
            </Form.Group>
            <Form.Label>Notes</Form.Label>
            <div className="mb-3" key={notes.length}>
                {notes.map((note, index) => (
                    <InputGroup className="mb-1" key={index}>
                        <Form.Control
                            type="text"
                            placeholder="Libellé"
                            defaultValue={note}
                            onChange={(e) =>
                                onUpdate({
                                    type,
                                    identifier,
                                    required,
                                    text,
                                    notes: [...notes.slice(0, index), e.target.value, ...notes.slice(index + 1)],
                                })
                            }
                        />
                        <Button variant="danger" onClick={() => onRemoveNote(index)}>
                            x
                        </Button>
                    </InputGroup>
                ))}
                <Button variant="light" onClick={onAddNote}>
                    Ajouter note
                </Button>
            </div>
        </>
    )
}

export default {
    type: 'notes',
    label: 'Notes',
    default: () => ({
        identifier: uuidv4(),
        required: true,
        text: 'Question par défaut',
        notes: [],
    }),
    Render,
    Preview,
    Editor,
}
