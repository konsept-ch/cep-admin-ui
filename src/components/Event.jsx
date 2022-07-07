import { DATE_FORMAT_SWISS_FRENCH } from '../constants/constants'
import { dateOptions } from '../utils'

export const Event = ({ selectedEvent }) => (
    <dl>
        <dt>Description :</dt>
        <dd>{selectedEvent.extendedProps.description}</dd>

        <dt>Salle :</dt>
        <dd>{selectedEvent.extendedProps.room?.name}</dd>

        <dt>Étage :</dt>
        <dd>{selectedEvent.extendedProps.room?.description}</dd>

        <dt>Capacité :</dt>
        <dd>{selectedEvent.extendedProps.room?.capacity}</dd>

        <dt>Participants inscrits :</dt>
        <dd>{selectedEvent.extendedProps.studentsCount}</dd>

        <dt>Temps</dt>
        <dd className="pl-3">
            <b>Début</b> :<br />
            {Intl.DateTimeFormat(DATE_FORMAT_SWISS_FRENCH, dateOptions).format(selectedEvent.range.start)}
            <br />
            <b>Fin</b> :<br />
            {Intl.DateTimeFormat(DATE_FORMAT_SWISS_FRENCH, dateOptions).format(selectedEvent.range.end)}
        </dd>

        <dt>Créé par :</dt>
        <dd className="pl-3">
            <b>Début</b> -{Intl.DateTimeFormat(DATE_FORMAT_SWISS_FRENCH, dateOptions).format(selectedEvent.range.start)}
            <br />
            <b>Fin</b> - {Intl.DateTimeFormat(DATE_FORMAT_SWISS_FRENCH, dateOptions).format(selectedEvent.range.end)}
        </dd>

        <dt>Formateurs :</dt>
        <dd className="pl-3">
            <ul>
                {selectedEvent.extendedProps.teachers?.map((teacher, index) => (
                    <li key={index}>{teacher}</li>
                ))}
            </ul>
        </dd>

        <dt>Séances :</dt>
        <dd className="pl-3">
            <ul>
                {selectedEvent.extendedProps.seances?.map((seance, index) => (
                    <li key={index}>{seance}</li>
                ))}
            </ul>
        </dd>
    </dl>
)
