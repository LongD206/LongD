import axios from 'axios';

const { VITE_VUE_API_URL } = import.meta.env;

const api = axios.create({
  withCredentials: true,
  baseURL: VITE_VUE_API_URL, // API의 기본 URL을 여기에 설정합니다.
  headers: {
    'Content-Type': 'application/json',
    // 다른 헤더를 필요에 따라 설정할 수 있습니다.
  },
});

// 가상 서버 키는 법: npm run db
// (터미널 하나 추가 필요)

// 임시(가상의) DB 용
const api2 = axios.create({
  baseURL: 'http://localhost:5000/albums', // API의 기본 URL을 여기에 설정합니다.
  headers: {
    'Content-Type': 'application/json',
    // 다른 헤더를 필요에 따라 설정할 수 있습니다.
  },
});
export { api, api2 };