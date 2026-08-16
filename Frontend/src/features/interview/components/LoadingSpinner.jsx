const LoadingSpinner = ({ label = 'Loading...' }) => {
    return (
        <div className='loading-spinner' role='status' aria-live='polite'>
            <span className='loading-spinner__ring' aria-hidden='true' />
            <h1 className='loading-spinner__label'>{label}</h1>
        </div>
    )
}

export default LoadingSpinner
