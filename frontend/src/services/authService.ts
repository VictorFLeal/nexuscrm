import axios from 'axios'

const API = import.meta.env.VITE_API_URL

export const authService = {
  login: (email: string, password: string) => {
    return axios.post(`${API}/auth/login`, {
      email,
      password,
    })
  },

  register: (data: {
    name: string
    email: string
    company: string
    password: string
  }) => {
    return axios.post(`${API}/auth/register`, data)
  },
}