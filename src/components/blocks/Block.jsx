import { Form } from 'react-bootstrap'

import Notes from './Notes'
import Paragraph from './Paragraph'
import Remark from './Remark'
import Title from './Title'

const blocks = [Title, Paragraph, Notes, Remark].reduce(
    (acc, component) => ({
        ...acc,
        [component.type]: component,
    }),
    {}
)

export const Block = {
    Render: (props) => {
        const BlockInner = blocks[props.type]
        return (
            <div className={`block render ${props.type}`}>
                <BlockInner.Render {...props} />
            </div>
        )
    },
    Preview: (props) => {
        const BlockInner = blocks[props.type]
        return (
            <div
                className={`block preview ${props.type} ${props.selected ? 'selected' : ''}`}
                onClick={(e) => {
                    e.preventDefault()
                    props.onSelected()
                }}
            >
                <BlockInner.Preview {...props} />
            </div>
        )
    },
    Editor: ({ onUpdate, ...props }) => {
        const BlockInner = blocks[props.type]
        return (
            <>
                <Form.Group className="mb-3">
                    <Form.Label>Type</Form.Label>
                    <Form.Select
                        value={props.type}
                        onChange={(e) => {
                            const block = blocks[e.target.value]
                            onUpdate({
                                type: block.type,
                                ...block.default(),
                            })
                        }}
                    >
                        {Object.entries(blocks).map(([type, block]) => (
                            <option key={type} value={type}>
                                {block.label}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <BlockInner.Editor {...props} onUpdate={onUpdate} />
            </>
        )
    },
}
