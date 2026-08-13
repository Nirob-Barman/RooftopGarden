import { createSlice } from '@reduxjs/toolkit'

type Theme = 'light' | 'dark'

const stored = localStorage.getItem('theme') as Theme | null
const initialState: Theme =
  stored ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

document.documentElement.classList.toggle('dark', initialState === 'dark')

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      const next: Theme = state === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', next)
      document.documentElement.classList.toggle('dark', next === 'dark')
      return next
    },
  },
})

export const { toggleTheme } = themeSlice.actions
export default themeSlice.reducer
