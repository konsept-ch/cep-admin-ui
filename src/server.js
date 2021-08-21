export const usersDataUrl = 'http://localhost:3002/usernames'

const token = '0344f22f5d85c9413840e89967a4e19f09ce'

export const otherParams = {
    method: 'GET',
    mode: 'no-cors',
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
        'CLAROLINE-API-TOKEN': token,
    },
}

export const loadFromClaroline = (saveData) => {
    const api = '/apiv2/user'
    const baseUrl = 'https://www.cep-val.ch'
    const url = `${baseUrl}${api}?apitoken=${token}`

    fetch(url, otherParams)
        .then((res) => res.json())
        .then(saveData)
        // eslint-disable-next-line no-console
        .catch(console.log)
}
