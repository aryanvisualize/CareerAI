import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { useInterview } from '../hooks/useInterview.js'
import AppNavigation from '../components/AppNavigation.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import '../style/home.scss'

const Plans = () => {
    const { loading, reports, setReportPinned, removeReport } = useInterview()
    const navigate = useNavigate()
    const [query, setQuery] = useState('')
    const [filter, setFilter] = useState('all')
    const [openMenuId, setOpenMenuId] = useState(null)
    const [actionError, setActionError] = useState('')

    const sortedReports = useMemo(() => [...reports].sort((first, second) =>
        Number(Boolean(second.isPinned)) - Number(Boolean(first.isPinned)) ||
        (Date.parse(second.createdAt) || 0) - (Date.parse(first.createdAt) || 0)
    ), [reports])
    const visibleReports = sortedReports.filter(report => {
        const title = (report.title || 'Untitled Position').toLowerCase()
        return title.includes(query.trim().toLowerCase()) && (filter !== 'pinned' || report.isPinned)
    })
    const pinnedCount = reports.filter(report => report.isPinned).length

    const togglePin = async report => {
        setActionError('')
        try {
            await setReportPinned(report._id, !report.isPinned)
            setOpenMenuId(null)
        } catch (error) {
            setActionError(error.message)
        }
    }

    const deletePlan = async report => {
        const title = report.title || 'Untitled plan'
        if (!window.confirm(`Delete “${title}”? This permanently removes the plan.`)) return
        setActionError('')
        try {
            await removeReport(report._id)
            setOpenMenuId(null)
        } catch (error) {
            setActionError(error.message)
        }
    }

    if (loading) {
        return <main className='loading-screen'><LoadingSpinner label='Loading your interview plans...' /></main>
    }

    return (
        <div className='home-page plans-page'>
            <AppNavigation />
            <main className='plans-content'>
                <section className='plans-hero'>
                    <div className='plans-hero__copy'>
                        <span className='plans-eyebrow'>CAREER WORKSPACE</span>
                        <h1>Your interview plans</h1>
                        <p>Pick up where you left off. Review your preparation, track your match scores, and keep your strongest plans close.</p>
                    </div>
                    <button type='button' className='generate-btn plans-hero__cta' onClick={() => navigate('/')}>
                        <span aria-hidden='true'>＋</span> Create a plan
                    </button>
                    <div className='plans-stats' aria-label='Plan summary'>
                        <div><strong>{reports.length}</strong><span>Plans created</span></div>
                        <div><strong>{pinnedCount}</strong><span>Pinned for later</span></div>
                    </div>
                </section>

                <section className='plans-browser' aria-labelledby='plans-heading'>
                    <div className='plans-browser__heading'>
                        <div>
                            <h2 id='plans-heading'>All interview plans</h2>
                            <p>{visibleReports.length} {visibleReports.length === 1 ? 'plan' : 'plans'} in your workspace</p>
                        </div>
                        <label className='plans-search'>
                            <span className='sr-only'>Search by job title</span>
                            <svg aria-hidden='true' viewBox='0 0 24 24'><circle cx='11' cy='11' r='7' /><path d='m16 16 4 4' /></svg>
                            <input type='search' value={query} onChange={event => setQuery(event.target.value)} placeholder='Search job titles' />
                        </label>
                    </div>

                    <div className='plans-filters' role='group' aria-label='Filter interview plans'>
                        <button type='button' className={filter === 'all' ? 'is-active' : ''} onClick={() => setFilter('all')}>All plans <span>{reports.length}</span></button>
                        <button type='button' className={filter === 'pinned' ? 'is-active' : ''} onClick={() => setFilter('pinned')}>Pinned <span>{pinnedCount}</span></button>
                    </div>

                    {visibleReports.length > 0 ? (
                        <ul className='reports-list'>
                            {visibleReports.map(report => {
                                const title = report.title || 'Untitled Position'
                                const scoreClass = report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'
                                return (
                                    <li key={report._id} className={`report-item${report.isPinned ? ' is-pinned' : ''}`}>
                                        <button type='button' className='report-menu-trigger' aria-label={`Actions for ${title}`} aria-haspopup='menu' aria-expanded={openMenuId === report._id}
                                            onClick={() => { setActionError(''); setOpenMenuId(id => id === report._id ? null : report._id) }}>
                                            <span aria-hidden='true'>⋮</span>
                                        </button>
                                        <button type='button' className='report-card' onClick={() => navigate(`/interview/${report._id}`)}>
                                            <span className='plan-card__type'>INTERVIEW PREP</span>
                                            <h3 title={title}>{title}</h3>
                                            {report.isPinned && <span className='report-pinned-label'>Pinned</span>}
                                            <div className='report-card__meta'>
                                                <time dateTime={report.createdAt}>{new Date(report.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</time>
                                                <span className={`report-score ${scoreClass}`}>{report.matchScore}% match</span>
                                            </div>
                                            <span className='report-card__action'>Review plan <span aria-hidden='true'>→</span></span>
                                        </button>
                                        {openMenuId === report._id && (
                                            <div className='report-menu' role='menu' aria-label={`Actions for ${title}`} onKeyDown={event => { if (event.key === 'Escape') setOpenMenuId(null) }}>
                                                <button type='button' role='menuitem' onClick={() => togglePin(report)}>{report.isPinned ? 'Unpin plan' : 'Pin plan'}</button>
                                                <button type='button' role='menuitem' className='report-menu__delete' onClick={() => deletePlan(report)}>Delete plan</button>
                                                {actionError && <p className='report-menu__error' role='alert'>{actionError}</p>}
                                            </div>
                                        )}
                                    </li>
                                )
                            })}
                        </ul>
                    ) : (
                        <div className='plans-empty'>
                            <span className='plans-empty__icon' aria-hidden='true'>⌕</span>
                            <h3>{reports.length ? 'No plans found' : 'Your next opportunity starts here'}</h3>
                            <p>{reports.length ? 'Try another job title or switch your filter.' : 'Create a tailored interview plan and build a clear path toward your next role.'}</p>
                            {!reports.length && <button type='button' className='generate-btn' onClick={() => navigate('/')}>Create your first plan</button>}
                        </div>
                    )}
                </section>

                <footer className='page-footer'><p>© 2026 CareerAI · Built with React, Node.js, MongoDB &amp; Gemini · <a href='https://www.linkedin.com/in/aryan-rastogi-dev/' target='_blank' rel='noopener noreferrer'>Aryan Rastogi</a></p></footer>
            </main>
        </div>
    )
}

export default Plans
