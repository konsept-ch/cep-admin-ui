const dateOptions = {
    year: 'numeric',
    month: 'long',
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
}

export const Event = ({ selectedEvent }) =>
    console.log(selectedEvent) || (
        <dl>
            <dt>Description :</dt>
            <dd>{selectedEvent.extendedProps.description}</dd>

            <dt>Salle :</dt>
            <dd>
                {selectedEvent.extendedProps.room.name} <br /> {JSON.stringify(selectedEvent.extendedProps)}
            </dd>

            <dt>Temps</dt>
            <dd className="pl-3">
                <b>Début</b> :<br />
                {Intl.DateTimeFormat('fr-CH', dateOptions).format(selectedEvent.range.start)}
                <br />
                <b>Fin</b> :<br />
                {Intl.DateTimeFormat('fr-CH', dateOptions).format(selectedEvent.range.end)}
            </dd>

            <dt>Créé par :</dt>
            <dd className="pl-3">
                <b>Début</b> -{Intl.DateTimeFormat('fr-CH', dateOptions).format(selectedEvent.range.start)}
                <br />
                <b>Fin</b> - {Intl.DateTimeFormat('fr-CH', dateOptions).format(selectedEvent.range.end)}
            </dd>
        </dl>
    )
