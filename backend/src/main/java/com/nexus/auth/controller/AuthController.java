import axios from 'axios'

const API = import.meta.env.VITE_API_URL

export const authService = {
  login: (email: string, password: string) => {
    return axios.post(`${API}/api/auth/login`, {
      email,
      password,
    })
  },

  register: (data: any) => {
    return axios.post(`${API}/api/auth/register`, data)
  },

  refresh: (refreshToken: string) => {
    return axios.post(`${API}/api/auth/refresh`, {
      refreshToken,
    })
  },

  me: (token: string) => {
    return axios.get(`${API}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },
}