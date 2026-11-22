import { useTheme } from './theme.context.jsx'

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme()
    const nextTheme = theme === 'dark' ? 'light' : 'dark'

    return (
        <button
            type='button'
            className='theme-toggle'
            onClick={toggleTheme}
            aria-pressed={theme === 'light'}
            aria-label={`Switch to ${nextTheme} theme`}
            title={`Switch to ${nextTheme} theme`}
        >
            {theme === 'dark' ? (
                <svg aria-hidden='true' viewBox='0 0 24 24' width='17' height='17' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round'>
                    <circle cx='12' cy='12' r='4' />
                    <path d='M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42' />
                </svg>
            ) : (
                <svg aria-hidden='true' viewBox='0 0 24 24' width='17' height='17' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round'>
                    <path d='M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z' />
                </svg>
            )}
            <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
        </button>
    )
}

export default ThemeToggle
