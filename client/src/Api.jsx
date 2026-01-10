const api = process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : ''
// const api = 'http://localhost:5000/'
// const api = 'https://trivialive.myrender.eu/'
console.log("API URL:", api);
export default api