import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import AuthLayout from '../components/AuthLayout.jsx'
import { useAuth } from '../hooks/useAuth.js'

const Register = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { loading, handleRegister } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const success = await handleRegister({ username, email, password })
        if (success) {
            navigate('/')
        }
    }

    if (loading) {
        return (
            <AuthLayout>
                <div className='auth-loading' role='status'>
                    <span className='auth-loading__ring' aria-hidden='true' />
                    <span>Please wait...</span>
                </div>
            </AuthLayout>
        )
    }

    return (
        <AuthLayout>
            <div className='form-container'>
                <header className='auth-intro'>
                    <p className='auth-eyebrow'>Start preparing</p>
                    <h1>Create your account</h1>
                    <p>Build a personalized interview plan for the role you want.</p>
                </header>

                <form onSubmit={handleSubmit}>
                    <div className='input-group'>
                        <label htmlFor='username'>Username</label>
                        <input
                            onChange={(e) => setUsername(e.target.value)}
                            type='text'
                            id='username'
                            name='username'
                            placeholder='Your name'
                            autoComplete='username'
                            required
                        />
                    </div>
                    <div className='input-group'>
                        <label htmlFor='email'>Email</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type='email'
                            id='email'
                            name='email'
                            placeholder='you@example.com'
                            autoComplete='email'
                            required
                        />
                    </div>
                    <div className='input-group'>
                        <label htmlFor='password'>Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type='password'
                            id='password'
                            name='password'
                            placeholder='Create a password'
                            autoComplete='new-password'
                            required
                        />
                    </div>
                    <button type='submit' className='button primary-button'>Create account</button>
                </form>

                <p className='auth-switch'>Already have an account? <Link to='/login'>Sign in</Link></p>
            </div>
        </AuthLayout>
    )
}

export default Register
