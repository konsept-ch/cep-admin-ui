import { SAVE_DATA } from '../constants/actions'

const initialState = {
    data: [
        {
            participant: 'John Doe',
            profession: 'Cadre spécialiste',
            session: "Droit administratif : l'essentiel",
            status: 'En attente',
            startDate: '13.08.2021',
        },
        {
            participant: 'Antoinette Bourguignon Carpentier',
            profession: 'Cadre spécialiste',
            session: "Proposition au Conseil d'Etat : l'essentiel pour être compris par l'exécutif",
            status: 'Entrée Web',
            startDate: '13.08.2021',
        },
        {
            participant: 'Anastasie Harquin',
            profession: 'Personnel Enseignant',
            session: 'Marchés publics : aspects théoriques et pratiques',
            status: 'Entrée Web',
            startDate: '15.08.2021',
        },
    ],
}

export const dataReducer = (state = initialState, action) => {
    switch (action.type) {
        case SAVE_DATA:
            // eslint-disable-next-line no-console
            console.log(state)
            return {
                data: [...state.data, ...action.payload],
            }
        default:
            return state
    }
}

export const dataSelector = (state) => state.data
