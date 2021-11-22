import { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { Editor, EditorState, Modifier, CompositeDecorator, ContentState } from 'draft-js'

const entities = {
    participantName: '[NOM_DU_PARTICIPANT]',
    sessionName: '[NOM_DE_LA_SESSION]',
    startingDate: '[DATE_DE_DÉBUT]',
}

const ParticipantNameStrategy = (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges((character) => {
        const entityKey = character.getEntity()
        return entityKey !== null && contentState.getEntity(entityKey).getType() === entities.participantName
    }, callback)
}

const ParticipantNameWrapper = () => (
    <span className="styled-span" contentEditable={false}>
        [NOM_DU_PARTICIPANT]
    </span>
)

const SessionNameStrategy = (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges((character) => {
        const entityKey = character.getEntity()
        return entityKey !== null && contentState.getEntity(entityKey).getType() === entities.sessionName
    }, callback)
}

const SessionNameWrapper = () => (
    <span className="styled-span" contentEditable={false}>
        [NOM_DE_LA_SESSION]
    </span>
)

const StartingDateStrategy = (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges((character) => {
        const entityKey = character.getEntity()
        return entityKey !== null && contentState.getEntity(entityKey).getType() === entities.startingDate
    }, callback)
}

const StartingDateWrapper = () => (
    <span className="styled-span" contentEditable={false}>
        [DATE_DE_DÉBUT]
    </span>
)

const decorator = new CompositeDecorator([
    {
        strategy: ParticipantNameStrategy,
        component: ParticipantNameWrapper,
    },
    {
        strategy: SessionNameStrategy,
        component: SessionNameWrapper,
    },
    {
        strategy: StartingDateStrategy,
        component: StartingDateWrapper,
    },
])

export const EmailTemplateBodyInput = ({ onChange, value: { value, templateId: templateIdProp } }) => {
    const [state, setState] = useState({
        editorState: EditorState.createWithContent(ContentState.createFromText(value), decorator),
    })

    const [templateId, setTemplateId] = useState(templateIdProp)

    useEffect(() => {
        if (templateId !== templateIdProp) {
            setState({
                editorState: EditorState.createWithContent(ContentState.createFromText(value), decorator),
            })
            setTemplateId(templateIdProp)
        }
    }, [value])

    const handleChange = (editorState) => {
        setState({ editorState })
        onChange(editorState.getCurrentContent().getPlainText('\u0001'))
    }

    const insert = (entity) => {
        const { editorState } = state
        let contentState = editorState.getCurrentContent()
        const selectionState = editorState.getSelection()
        const contentStateWithEntity = contentState.createEntity(entity, 'IMMUTABLE')
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
        contentState = Modifier.insertText(contentState, selectionState, ' ')
        contentState = Modifier.insertText(contentState, selectionState, entity, null, entityKey)
        contentState = Modifier.insertText(contentState, selectionState, ' ')

        let newState = EditorState.push(editorState, contentState, 'insert-characters')

        if (!newState.getCurrentContent().equals(editorState.getCurrentContent())) {
            const sel = newState.getSelection()
            const updatedSelection = sel.merge({
                anchorOffset: sel.getAnchorOffset(),
                focusOffset: sel.getAnchorOffset() + 1,
            })
            newState = EditorState.forceSelection(newState, updatedSelection)
        }
        setState({ editorState: newState })
    }

    return (
        <div className="email-template-editor">
            <div className="container-root">
                <Editor placeholder="" editorState={state.editorState} onChange={handleChange} />
            </div>
            <Button variant="outline-dark" onClick={() => insert(entities.startingDate)} className="me-2">
                [DATE_DE_DÉBUT]
            </Button>
            <Button variant="outline-dark" onClick={() => insert(entities.participantName)} className="me-2">
                [NOM_DU_PARTICIPANT]
            </Button>
            <Button variant="outline-dark" onClick={() => insert(entities.sessionName)}>
                [NOM_DE_LA_SESSION]
            </Button>
        </div>
    )
}
