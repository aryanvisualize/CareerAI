import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'
import AuthLayout from '../components/AuthLayout.jsx'

const Login = () => {

    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await handleLogin({
            email,
            password
        });
        if (success) {
            navigate("/");
        }
    };

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
                    <p className='auth-eyebrow'>Welcome back</p>
                    <h1>Sign in</h1>
                    <p>Pick up where you left off and keep preparing for your next opportunity.</p>
                </header>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={(e) => { setEmail(e.target.value) }}
                            type="email" id="email" name='email' placeholder='you@example.com'
                            autoComplete='email' required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => { setPassword(e.target.value) }}
                            type="password" id="password" name='password' placeholder='Enter your password'
                            autoComplete='current-password' required />
                    </div>
                    <button type='submit' className='button primary-button'>Sign in</button>
                </form>
                <p className='auth-switch'>New to CareerAI? <Link to='/register'>Create an account</Link></p>
            </div>
        </AuthLayout>
    )
}

export default Login
