import axios from 'axios'
// const API_URL = process.env.URL_API
const API_URL = 'https://training-silacak.kemkes.go.id/api'

export const getWithAuth = async (url, params = {}) => {
  try {
    const r = await axios.get(`${API_URL}${url}`, {
      headers: {
        "content-type": "application/json",
        Authorization: `Basic dGF1ZmlxaHM6VGhzMjEwMTA5MS82M24l`
      },
      params: {
        ...params,
      },
    });
    return r;
  } catch (err) {
    const r = err.response || {};
    if(r.status===401){
      window.location.reload()
    }
    r.isError = true;
    return r;
  }
};
