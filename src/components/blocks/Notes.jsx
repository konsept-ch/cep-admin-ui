import { Form, Button, InputGroup } from 'react-bootstrap'

const Render = ({ name, text, notes, onUpdate }) => {
    return (
        <>
            <p>{text}</p>
            <div className="d-flex gap-2">
                {notes.map((note, index) => (
                    <Form.Check
                        key={index}
                        type="radio"
                        name={name}
                        id={`${name}-${note}`}
                        label={note}
                        value={note}
                        onChange={(e) => onUpdate(name, e.target.value)}
                    />
                ))}
            </div>
        </>
    )
}

const Preview = ({ name, text, notes }) => {
    return (
        <>
            <p>{text}</p>
            <div className="d-flex gap-2">
                {notes.map((note, index) => (
                    <Form.Check key={index} type="radio" name={name} id={`${name}-${note}`} label={note} />
                ))}
            </div>
        </>
    )
}

const Editor = ({ type, name, text, notes, onUpdate }) => {
    const onAddNote = () => {
        onUpdate({
            type,
            name,
            text,
            notes: [...notes, `${notes.length + 1}`],
        })
    }

    const onRemoveNote = (index) => {
        onUpdate({
            type,
            name,
            text,
            notes: [...notes.slice(0, index), ...notes.slice(index + 1)],
        })
    }

    return (
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
                            name,
                            text: e.target.value,
                            notes,
                        })
                    }
                />
            </Form.Group>
            <Form.Label>Notes</Form.Label>
            <div className="mb-3">
                {notes.map((note, index) => (
                    <InputGroup className="mb-1">
                        <Form.Control
                            key={notes.length + index}
                            type="text"
                            placeholder="Libellé"
                            defaultValue={note}
                            onChange={(e) =>
                                onUpdate({
                                    type,
                                    name,
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
    default: {
        identifier: 'abc',
        text: 'Question par défaut',
        min: 1,
        max: 5,
    },
    Render,
    Preview,
    Editor,
}
