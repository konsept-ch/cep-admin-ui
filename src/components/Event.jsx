import { DATE_FORMAT_SWISS_FRENCH } from '../constants/constants'
import { dateOptions } from '../utils'

export const Event = ({
    selectedEvent: {
        extendedProps: {
            description,
            room,
            studentsCount,
            teachers,
            seances,
            creator,
            sessionInscriptionsCount,
            sessionMaxUsers,
            isFirstPhysical,
        },
        range,
    },
}) => (
    <dl>
        <dt>Est-ce la première séance physique ?</dt>
        <dd>
            {isFirstPhysical ? (
                <>
                    <span className="first-physical-indicator">Oui</span> - dans cette session, ceci est la première
                    séance dans le lieu "CEP"
                </>
            ) : (
                <>
                    Non <em>(selon algorithme actuel)</em>
                </>
            )}
        </dd>

        <dt>Description :</dt>
        <dd>{description}</dd>

        <dt>Salle :</dt>
        <dd>{room?.name}</dd>

        <dt>Étage :</dt>
        <dd>{room?.description}</dd>

        <dt>Capacité salle :</dt>
        <dd>{room?.capacity}</dd>

        <dt>Participants inscrits à la séance :</dt>
        <dd>{studentsCount}</dd>

        <dt>Occupation de la session :</dt>
        <dd>
            {!(sessionMaxUsers > -1)
                ? '(aucune restriction de nombre de participants)'
                : `${sessionInscriptionsCount}/${sessionMaxUsers}`}
        </dd>

        <dt>Heures</dt>
        <dd className="ps-3">
            <b>Début</b> :<br />
            {Intl.DateTimeFormat(DATE_FORMAT_SWISS_FRENCH, dateOptions).format(range.start)}
            <br />
            <b>Fin</b> :<br />
            {Intl.DateTimeFormat(DATE_FORMAT_SWISS_FRENCH, dateOptions).format(range.end)}
        </dd>

        <dt>Créé par :</dt>
        <dd>
            {creator.lastName} {creator.firstName} &lt;{creator.email}&gt;
        </dd>

        <dt>Formateurs :</dt>
        <dd className="pl-3">
            <ul>
                {teachers?.map((teacher, index) => (
                    <li key={index}>{teacher}</li>
                ))}
            </ul>
        </dd>

        <dt>Autres séances :</dt>
        <dd className="pl-3">
            <ul>
                {seances?.map((seance, index) => (
                    <li key={index}>{seance}</li>
                ))}
            </ul>
        </dd>
    </dl>
)
