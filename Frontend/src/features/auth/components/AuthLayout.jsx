import '../auth.form.scss'
import ThemeToggle from '../../../ThemeToggle.jsx'

const AuthLayout = ({ children }) => (
    <main className='auth-page'>
        <div className='auth-shell'>
            <aside className='auth-visual' aria-label='CareerAI interview preparation'>
                <div className='auth-visual__art' aria-hidden='true'>
                    <span className='auth-visual__glow' />
                    <span className='auth-visual__mountain auth-visual__mountain--far' />
                    <span className='auth-visual__mountain auth-visual__mountain--near' />
                </div>

                <div className='auth-visual__top'>
                    <div className='auth-brand'>
                        <span className='auth-brand__mark'>C</span>
                        <span>CareerAI</span>
                    </div>
                    <span className='auth-visual__badge'>Interview prep</span>
                </div>

                <div className='auth-visual__copy'>
                    <p className='auth-eyebrow'>Prepare with purpose</p>
                    <p className='auth-visual__headline'>Make your next interview count.</p>
                    <p>Build a focused plan with role-specific questions, skill insights, and a clear roadmap.</p>
                </div>

                <div className='auth-visual__footer' aria-hidden='true'>
                    <span>Plan with confidence</span>
                    <span className='auth-visual__separator' />
                    <span>Show up prepared</span>
                </div>
            </aside>

            <section className='auth-content' aria-label='Account access'>
                <div className='auth-content__tools'>
                    <ThemeToggle />
                </div>
                {children}
            </section>
        </div>
    </main>
)

export default AuthLayout
