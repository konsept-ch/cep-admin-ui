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
        const Block = blocks[props.type]
        return (
            <div
                className={`property ${props.selected ? 'selected' : ''}`}
                onClick={(e) => {
                    e.preventDefault()
                    props.onSelected()
                }}
            >
                <Block.Render {...props} />
            </div>
        )
    },
    Editor: (props) => {
        const Block = blocks[props.type]
        return (
            <>
                <Form.Group className="mb-3">
                    <Form.Label>Type</Form.Label>
                    <Form.Select
                        value={Block.type}
                        onChange={(e) => {
                            const block = blocks[e.target.value]
                            const def = {
                                type: block.type,
                                ...block.default,
                            }
                            props.onTypeUpdate(def)
                            props.onUpdate(def)
                        }}
                    >
                        {Object.entries(blocks).map(([type, block]) => (
                            <option key={type} value={type}>
                                {block.label}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Block.Editor {...props} />
            </>
        )
    },
}
