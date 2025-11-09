const updateProfile = async (fields) => {
  const { data } = await api.put('/user/me', fields)
  setUser(data)
  localStorage.setItem('user', JSON.stringify(data))
  return data
}

import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'))
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    setUser(data.user)
    setToken(data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('token', data.token)
  }

  const register = async (name, email, password) => {
    await api.post('/auth/register', { name, email, password })
    return login(email, password)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  const updateProfile = async (fields) => {
    const { data } = await api.put('/user/me', fields)
    setUser(data)
    localStorage.setItem('user', JSON.stringify(data))
    return data
  }

  return (
    <AuthCtx.Provider value={{ user, token, login, register, logout, updateProfile }}>
      {children}
    </AuthCtx.Provider>
  )
}

export const useAuth = () => useContext(AuthCtx)