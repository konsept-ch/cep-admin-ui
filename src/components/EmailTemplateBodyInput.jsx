import { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import classNames from 'classnames'
import { Editor, EditorState, Modifier, CompositeDecorator, ContentState, RichUtils } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'
import htmlToDraft from 'html-to-draftjs'

const DecoratorStrategy = (entity) => (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges((character) => {
        const entityKey = character.getEntity()
        return entityKey !== null && contentState.getEntity(entityKey).getType() === entity
    }, callback)
}

const DecoratorWrapper = (entity) => () => entity

const entities = {
    participantName: '[PARTICIPANT_NOM]',
    sessionName: '[SESSION_NOM]',
    startingDate: '[SESSION_DATE_DÉBUT]',
    location: '[LIEU]',
    lessons: '[SESSION_RÉSUMÉ_DATES]',
    civility: '[PARTICIPANT_CIVILITÉ]',
    inscriptionDate: '[INSCRIPTION_DATE]',
    evaluationLink: '[EVALUATION_LIEN]',
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
    {
        strategy: DecoratorStrategy(entities.location),
        component: DecoratorWrapper(entities.location),
    },
    {
        strategy: DecoratorStrategy(entities.lessons),
        component: DecoratorWrapper(entities.lessons),
    },
    {
        strategy: DecoratorStrategy(entities.civility),
        component: DecoratorWrapper(entities.civility),
    },
    {
        strategy: DecoratorStrategy(entities.inscriptionDate),
        component: DecoratorWrapper(entities.inscriptionDate),
    },
    {
        strategy: DecoratorStrategy(entities.evaluationLink),
        component: DecoratorWrapper(entities.evaluationLink),
    },
])

export function EmailTemplateBodyInput({
    className,
    onChange,
    templateId,
    value,
    shouldHandleKeyCommand,
    shouldHaveVariables,
    isEmailSubjectInput,
    shouldHaveBlockTag,
    ...rest
}) {
    const convertStateFromHTML = (state) => {
        const blocksFromHTML = htmlToDraft(state)
        return ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap)
    }

    const [state, setState] = useState({
        editorState: EditorState.createWithContent(convertStateFromHTML(value), decorator),
    })

    useEffect(() => {
        setState({
            editorState: EditorState.createWithContent(convertStateFromHTML(value), decorator),
        })
    }, [templateId])

    const handleChange = (editorState) => {
        const htmlState = stateToHTML(editorState.getCurrentContent(), {
            defaultBlockTag: shouldHaveBlockTag ? 'p' : null,
        })

        onChange(htmlState)
        setState({ editorState })
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
        <>
            {shouldHaveVariables && (
                <div className="mt-2">
                    {Object.values(entities).map((entity) => (
                        <Button
                            key={entity}
                            variant="outline-dark"
                            onClick={() => insert(entity)}
                            className="me-2 mb-2"
                        >
                            {entity}
                        </Button>
                    ))}
                </div>
            )}
            <div className={classNames('container-root', className)}>
                <Editor
                    placeholder=""
                    editorState={state.editorState}
                    onChange={handleChange}
                    {...(isEmailSubjectInput ? { handleReturn: () => 'handled' } : {})}
                    {...(shouldHandleKeyCommand ? { handleKeyCommand } : {})}
                    {...rest}
                />
            </div>
        </>
    )
}
