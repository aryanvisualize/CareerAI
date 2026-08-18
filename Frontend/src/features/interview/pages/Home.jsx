import { useState, useRef } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { useAuth } from '../../auth/hooks/useAuth.js'

const Home = () => {

    const { loading, generateReport,reports } = useInterview()
    const { handleLogout } = useAuth()
    const [ jobDescription, setJobDescription ] = useState("")
    const [ selfDescription, setSelfDescription ] = useState("")
    const [ resumeFile, setResumeFile ] = useState(null)
    const [ isDragging, setIsDragging ] = useState(false)
    const resumeInputRef = useRef()
    const dragCounterRef = useRef(0)

    const navigate = useNavigate()

    const formatFileSize = (sizeInBytes) => {
        if (!sizeInBytes && sizeInBytes !== 0) return ''
        if (sizeInBytes < 1024) return `${sizeInBytes} B`
        if (sizeInBytes < 1024 * 1024) return `${Math.round(sizeInBytes / 1024)} KB`
        return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`
    }

    const getFileTypeLabel = (file) => {
        const extension = file.name.split('.').pop()?.toLowerCase()
        if (extension === 'pdf') return 'PDF'
        if (extension === 'docx') return 'DOCX'
        return 'File'
    }

    const isValidResumeFile = (file) => {
        const maxSize = 5 * 1024 * 1024
        const lowerName = file.name.toLowerCase()
        const validByName = lowerName.endsWith('.pdf') || lowerName.endsWith('.docx')
        const validMimeTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]
        const validByType = !file.type || validMimeTypes.includes(file.type)

        return validByName && validByType && file.size <= maxSize
    }

    const handleResumeFile = (file) => {
        if (!file || !isValidResumeFile(file)) {
            return
        }

        setResumeFile(file)

        if (resumeInputRef.current) {
            const dataTransfer = new DataTransfer()
            dataTransfer.items.add(file)
            resumeInputRef.current.files = dataTransfer.files
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            handleResumeFile(file)
        }
    }

    const handleDragEnter = (e) => {
        e.preventDefault()
        e.stopPropagation()
        dragCounterRef.current += 1
        setIsDragging(true)
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        e.stopPropagation()
        dragCounterRef.current -= 1
        if (dragCounterRef.current <= 0) {
            dragCounterRef.current = 0
            setIsDragging(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        dragCounterRef.current = 0
        setIsDragging(false)

        const file = e.dataTransfer.files?.[0]
        if (file) {
            handleResumeFile(file)
        }
    }

    const handleGenerateReport = async () => {
        const selectedResumeFile = resumeFile || resumeInputRef.current.files[0]
        const data = await generateReport({ jobDescription, selfDescription, resumeFile: selectedResumeFile })
        if (!data?._id) {
            // generateReport already logs the error; show a brief alert and stop
            window.alert("Failed to generate your interview plan. Please check your inputs and try again.")
            return
        }
        navigate(`/interview/${data._id}`)
    }

    const onLogout = async () => {
        const success = await handleLogout()
        if (success) {
            navigate('/login')
        }
    }
    if (loading) {
        return (
            <main className='loading-screen'>
                <LoadingSpinner label='Loading your interview plan...' />
            </main>
        )
    }
    return (
        <div className='home-page'>

            <header className='app-header'>
                <span className='app-header__brand'>CareerAI</span>
                <button
                    type='button'
                    onClick={onLogout}
                    className='generate-btn generate-btn--ghost'>
                    Logout
                </button>
            </header>

            {/* Page Header */}
            <header className='page-header'>
                <h1>Create Your Custom <span className='highlight'>Interview Plan</span></h1>
                <p>Let our AI analyze the job requirements and your unique profile to build a winning strategy.</p>
            </header>
            {/* Main Card */}
            <div className='interview-card'>
                <div className='interview-card__body'>

                    {/* Left Panel - Job Description */}
                    <div className='panel panel--left'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg height={"0.8rem"} style={{ marginRight: "0.8rem" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path></svg>
                        </span>
                            <h2>Target Job Description</h2>
                            <span className='badge badge--required'>Required</span>
                        </div>
                        <textarea
                            onChange={(e) => { setJobDescription(e.target.value) }}
                            className='panel__textarea'
                            placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
                            maxLength={5000}
                        />
                        <div className='char-counter'>0 / 5000 chars</div>
                    </div>
                    {/* Vertical Divider */}
                    <div className='panel-divider' />

                    {/* Right Panel - Profile */}
                    <div className='panel panel--right'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            </span>
                            <h2>Your Profile</h2>
                        </div>

                        {/* Upload Resume */}
                        <div className='upload-section'>
                            <label className='section-label'>
                                Upload Resume
                                <span className='badge badge--best'>Best Results</span>
                            </label>
                            <label
                                className={`dropzone ${isDragging ? 'dropzone--dragging' : ''} ${resumeFile ? 'dropzone--uploaded' : ''}`}
                                htmlFor='resume'
                                onDragEnter={handleDragEnter}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}>
                                <span className='dropzone__icon'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                                </span>
                                {!resumeFile && (
                                    <>
                                        <p className='dropzone__title'>{isDragging ? 'Drop your resume here' : 'Click to upload or drag & drop'}</p>
                                        <p className='dropzone__subtitle'>PDF or DOCX (Max 5MB)</p>
                                    </>
                                )}
                                {resumeFile && (
                                    <div className='dropzone__uploaded'>
                                        <p className='dropzone__check'>✓</p>
                                        <p className='dropzone__uploaded-title'>Resume uploaded</p>
                                        <p className='dropzone__file-name'>{resumeFile.name}</p>
                                        <p className='dropzone__file-meta'>{getFileTypeLabel(resumeFile)} • {formatFileSize(resumeFile.size)}</p>
                                    </div>
                                )}
                                <input ref={resumeInputRef} onChange={handleFileChange} hidden type='file' id='resume' name='resume' accept='.pdf,.docx' />
                            </label>
                        </div>

                        {/* OR Divider */}
                        <div className='or-divider'><span>OR</span></div>

                        {/* Quick Self-Description */}
                        <div className='self-description'>
                            <label className='section-label' htmlFor='selfDescription'>Quick Self-Description</label>
                            <textarea
                                onChange={(e) => { setSelfDescription(e.target.value) }}
                                id='selfDescription'
                                name='selfDescription'
                                className='panel__textarea panel__textarea--short'
                                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                            />
                        </div>

                        {/* Info Box */}
                        <div className='info-box'>
                            <span className='info-box__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" stroke="#1a1f27" strokeWidth="2" /><line x1="12" y1="16" x2="12.01" y2="16" stroke="#1a1f27" strokeWidth="2" /></svg>
                            </span>
                            <p>Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.</p>
                        </div>
                    </div>
                </div>

                {/* Card Footer */}
                <div className='interview-card__footer'>
                    <span className='footer-info'>AI-Powered Strategy Generation &bull; Approx 30s</span>
                    <button
                        onClick={handleGenerateReport}
                        disabled={loading}
                        className='generate-btn'>
                        <svg height={"0.8rem"} style={{ marginRight: "0.8rem" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path></svg>
                        {loading ? 'Generating...' : 'Generate My Interview Strategy'}
                    </button>
                </div>
            </div>

            {/* Recent Reports List */}
            {reports.length > 0 && (
                <section className='recent-reports'>
                    <h2>My Recent Interview Plans</h2>
                    <ul className='reports-list'>
                        {reports.map(report => (
                            <li key={report._id} className='report-item' onClick={() => navigate(`/interview/${report._id}`)}>
                                <h3>{report.title || 'Untitled Position'}</h3>
                                <p className='report-meta'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>Match Score: {report.matchScore}%</p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Page Footer */}
            <footer className='page-footer'>
                <p>
                    © 2026 CareerAI · Built with React, Node.js, MongoDB & Gemini ·{' '}
                    <a
                        href='https://www.linkedin.com/in/aryan-rastogi-dev/'
                        target='_blank'
                        rel='noopener noreferrer'>
                        Aryan Rastogi
                    </a>
                </p>
            </footer>
        </div>
    )
}

export default Home