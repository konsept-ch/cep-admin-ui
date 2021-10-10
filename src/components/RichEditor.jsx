import { useState } from 'react'
import { Editor, EditorState, ContentState, convertFromHTML, RichUtils } from 'draft-js'

export const RichEditor = ({ initialText }) => {
    const blocksFromHTML = convertFromHTML(initialText)
    const initialValue = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap)

    const [editorState, setEditorState] = useState(() => EditorState.createWithContent(initialValue))

    const handleKeyCommand = (command, keyCommandEditorState) => {
        const newState = RichUtils.handleKeyCommand(keyCommandEditorState, command)

        if (newState) {
            setEditorState(newState)
            return 'handled'
        }

        return 'not-handled'
    }

    return <Editor editorState={editorState} handleKeyCommand={handleKeyCommand} onChange={setEditorState} />
}
