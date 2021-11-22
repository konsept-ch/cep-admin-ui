import { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import classNames from 'classnames'
import { Editor, EditorState, Modifier, CompositeDecorator, ContentState } from 'draft-js'

const entities = {
    participantName: '[NOM_DU_PARTICIPANT]',
    sessionName: '[NOM_DE_LA_SESSION]',
    startingDate: '[DATE_DE_DÉBUT]',
}

const DecoratorStrategy = (entity) => (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges((character) => {
        const entityKey = character.getEntity()
        return entityKey !== null && contentState.getEntity(entityKey).getType() === entity
    }, callback)
}

const DecoratorWrapper = (entity) => () =>
    (
        <span className="styled-span" contentEditable={false}>
            {entity}
        </span>
    )

const decorator = new CompositeDecorator([
    {
        strategy: DecoratorStrategy(entities.participantName),
        component: DecoratorWrapper(entities.participantName),
    },
    {
        strategy: DecoratorStrategy(entities.sessionName),
        component: DecoratorWrapper(entities.sessionName),
    },
    {
        strategy: DecoratorStrategy(entities.startingDate),
        component: DecoratorWrapper(entities.startingDate),
    },
])

export const EmailTemplateBodyInput = ({ className, onChange, value: { value, templateId: templateIdProp } }) => {
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
                anchorOffset: sel.getAnchorOffset() + entity.length + 1,
                focusOffset: sel.getAnchorOffset() + entity.length + 1,
            })
            newState = EditorState.forceSelection(newState, updatedSelection)
        }
        setState({ editorState: newState })
    }

    return (
        <div className={classNames(className)}>
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
