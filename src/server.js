export const loadFromClaroline = () => {
    const token = 'd6e3791003a301563fadcc041be1cae027fd'
    const api = '/apiv2/user'
    const baseUrl = 'https://cep-dev.ch'
    const url = `${baseUrl}${api}?tokenapi=${token}`
    //   const url = `${baseUrl}${api}`;

    const otherParams = {
        method: 'GET',
        mode: 'no-cors',
        credentials: 'include',
    }

    fetch(url, otherParams)
        .then((res) => res.json())
        .then(console.log)
        .catch(console.log)
}
