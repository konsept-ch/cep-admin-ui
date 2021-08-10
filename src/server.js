export const usersDataUrl = 'http://localhost:3002/usernames'

const token = '718d6b1f87eb4544652966188d5d42db4eef'

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
    // const baseUrl = 'https://cep-dev.ch'
    const baseUrl = 'http://localhost'
    const url = `${baseUrl}${api}?apitoken=${token}`

    fetch(url, otherParams)
        .then((res) => res.json())
        .then(saveData)
        // eslint-disable-next-line no-console
        .catch(console.log)
}
