export const loadFromClaroline = () => {
  //   const token = "d6e3791003a301563fadcc041be1cae027fd";
  const api = "/apiv2/workspace";
  const baseUrl = "https://cep-dev.ch";
  //   const url = `${baseUrl}${api}?tokenapi=${token}`;
  const url = `${baseUrl}${api}`;

  fetch(url)
    .then((res) => res.json())
    .then(console.log)
    .catch(console.log);
};
