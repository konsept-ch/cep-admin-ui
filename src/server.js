export const usersDataUrl = 'http://localhost:3002/usernames'

export const loadFromClaroline = (saveData) => {
    const token = 'd6e3791003a301563fadcc041be1cae027fd'
    const api = '/apiv2/user'
    const baseUrl = 'https://cep-dev.ch'
    const url = `${baseUrl}${api}?tokenapi=${token}`

    const otherParams = {
        method: 'GET',
        mode: 'no-cors',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    }

    fetch(url, otherParams)
        .then((res) => res.json())
        .then(saveData)
        // eslint-disable-next-line no-console
        .catch(console.log)
}
