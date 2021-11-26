import { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import classNames from 'classnames'
import { Editor, EditorState, Modifier, CompositeDecorator, ContentState, RichUtils } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'
import { htmlToDraft } from 'html-to-draftjs'

const DecoratorStrategy = (entity) => (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges((character) => {
        const entityKey = character.getEntity()
        return entityKey !== null && contentState.getEntity(entityKey).getType() === entity
    }, callback)
}

const DecoratorWrapper = (entity) => () => entity

const entities = {
    participantName: '[NOM_DU_PARTICIPANT]',
    sessionName: '[NOM_DE_LA_SESSION]',
    startingDate: '[DATE_DE_DÉBUT]',
}

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
    // const convertStateFromHTML = (state) => {
    //     console.log(state)
    //     const blocksFromHTML = htmlToDraft(state)
    //     return ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap)
    // }

    const [state, setState] = useState({
        // editorState: EditorState.createWithContent(convertStateFromHTML(value), decorator),
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
        // const htmlState = stateToHTML(editorState.getCurrentContent())
        // onChange(htmlState)
        setState({ editorState })
        onChange(editorState.getCurrentContent().getPlainText('\u0001'))
    }

    const insert = (entity) => {
        const { editorState } = state
        let contentState = editorState.getCurrentContent()
        const selectionState = editorState.getSelection()
        const contentStateWithEntity = contentState.createEntity(entity, 'IMMUTABLE')
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
        if (selectionState.getAnchorOffset() !== selectionState.getFocusOffset()) {
            contentState = Modifier.replaceText(contentState, selectionState, entity, null, entityKey)
        } else {
            contentState = Modifier.insertText(contentState, selectionState, entity, null, entityKey)
        }

        let newState = EditorState.push(editorState, contentState, 'insert-characters')

        if (!newState.getCurrentContent().equals(editorState.getCurrentContent())) {
            const sel = newState.getSelection()
            const updatedSelection = sel.merge({
                anchorOffset: sel.getAnchorOffset() + entity.length + 1,
                focusOffset: sel.getAnchorOffset() + entity.length + 1,
            })
            newState = EditorState.forceSelection(newState, updatedSelection)
        }
        handleChange(newState)
    }

    const handleKeyCommand = (command, editorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command)

        if (newState) {
            handleChange(newState)
            return 'handled'
        }

        return 'not-handled'
    }

    return (
        <div className={classNames(className)}>
            <div className="container-root">
                <Editor
                    placeholder=""
                    editorState={state.editorState}
                    onChange={handleChange}
                    handleKeyCommand={handleKeyCommand}
                />
            </div>
            {Object.values(entities).map((entity) => (
                <Button variant="outline-dark" onClick={() => insert(entity)} className="me-2 mb-2">
                    {entity}
                </Button>
            ))}
        </div>
    )
}
