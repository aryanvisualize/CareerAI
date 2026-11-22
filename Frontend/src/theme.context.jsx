import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

const getInitialTheme = () => {
    let savedTheme = null
    try {
        savedTheme = window.localStorage.getItem('careerai-theme')
    } catch {
        // Keep the app usable when browser storage is unavailable.
    }
    const theme = savedTheme === 'light' ? 'light' : 'dark'
    document.documentElement.dataset.theme = theme
    return theme
}

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(getInitialTheme)

    useEffect(() => {
        document.documentElement.dataset.theme = theme
        try {
            window.localStorage.setItem('careerai-theme', theme)
        } catch {
            // The selected theme still applies for this session.
        }
    }, [theme])

    const toggleTheme = () => setTheme(currentTheme => currentTheme === 'dark' ? 'light' : 'dark')

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}
