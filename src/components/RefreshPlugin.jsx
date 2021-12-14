import React from 'react'
import { sliceEvents, createPlugin } from '@fullcalendar/react'

class CustomView extends React.Component {
    render(props) {
        // const segs = sliceEvents(props, true) // allDay=true

        return <>{/* <div class="view-events">{segs.length} events</div> */}</>
    }
}

export default createPlugin({
    views: {
        custom: CustomView,
    },
})
