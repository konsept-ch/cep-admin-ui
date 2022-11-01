import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

export const FloatCellEditor = forwardRef((props, ref) => {
    const [value, setValue] = useState(parseInt(props.value))
    const refInput = useRef(null)

    useEffect(() => {
        refInput.current.focus()
    }, [])

    useImperativeHandle(ref, () => {
        return {
            getValue() {
                return parseFloat(value)
            },
            isCancelBeforeStart() {
                return false
            },
            isCancelAfterEnd() {
                return isNaN(parseFloat(value))
            },
        }
    })

    return (
        <input
            type="text"
            ref={refInput}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            style={{ width: '100%', height: '100%' }}
        />
    )
})
