import { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { Editor, EditorState, Modifier, CompositeDecorator, ContentState } from 'draft-js'

const entities = {
    participantName: '[NOM_DU_PARTICIPANT]',
    sessionName: '[NOM_DE_LA_SESSION]',
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

const decorator = new CompositeDecorator([
    {
        strategy: ParticipantNameStrategy,
        component: ParticipantNameWrapper,
    },
    {
        strategy: SessionNameStrategy,
        component: SessionNameWrapper,
    },
])

export const EmailTemplateBodyInput = ({ onChange, value }) => {
    const [state, setState] = useState({
        editorState: EditorState.createWithContent(ContentState.createFromText(value), decorator),
    })

    useEffect(() => {
        const currentSelection = state.editorState.getSelection()
        const editorState = EditorState.createWithContent(ContentState.createFromText(value), decorator)
        const stateWithContentAndSelection = EditorState.forceSelection(editorState, currentSelection)
        // const stateWithContentAndSelection = EditorState.forceSelection(
        //     EditorState.createWithContent(ContentState.createFromText(value), decorator), currentSelection)
        // )
        setState({ editorState: stateWithContentAndSelection })
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
                anchorOffset: sel.getAnchorOffset() + 1,
                focusOffset: sel.getAnchorOffset() + 1,
            })
            // Forcing the current selection ensures that it will be at it's right place.
            newState = EditorState.forceSelection(newState, updatedSelection)
        }
        setState({ editorState: newState })
    }

    return (
        <div className="email-template-editor">
            <div className="container-root">
                <Editor placeholder="" editorState={state.editorState} onChange={handleChange} />
            </div>
            <Button variant="outline-dark" onClick={() => insert(entities.participantName)} className="me-2">
                [NOM_DU_PARTICIPANT]
            </Button>
            <Button variant="outline-dark" onClick={() => insert(entities.sessionName)}>
                [NOM_DE_LA_SESSION]
            </Button>
        </div>
    )
}
