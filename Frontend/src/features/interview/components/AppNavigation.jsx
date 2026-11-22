import { NavLink, useNavigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth.js'
import ThemeToggle from '../../../ThemeToggle.jsx'

const AppNavigation = () => {
    const { handleLogout } = useAuth()
    const navigate = useNavigate()

    const onLogout = async () => {
        const success = await handleLogout()
        if (success) navigate('/login')
    }

    return (
        <header className='app-header'>
            <NavLink to='/' className='app-header__brand' aria-label='CareerAI home'>
                Career<span>AI</span>
            </NavLink>
            <nav className='app-header__nav' aria-label='Main navigation'>
                <NavLink to='/' end className={({ isActive }) => isActive ? 'is-active' : ''}>Create plan</NavLink>
                <NavLink to='/plans' className={({ isActive }) => isActive ? 'is-active' : ''}>My plans</NavLink>
            </nav>
            <div className='app-header__actions'>
                <ThemeToggle />
                <button type='button' onClick={onLogout} className='generate-btn generate-btn--ghost'>Logout</button>
            </div>
        </header>
    )
}

export default AppNavigation
