export default function Logo({className="w-8 h-8"})
{
    return(
        <svg
            className={className}
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="PortfoLens"
        >
            <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:'#8b5cf6',stopOpacity:1}}></stop>
                    <stop offset="100%" style={{stopColor:'#3b82f6',stopOpacity:1}}></stop>
                </linearGradient>
            </defs>
            {/*Lens circle*/}
            <circle cx="100" cy="100" r="80" stroke="url(#logoGradient)" strokeWidth="12" fill="none"></circle>
            {/*Inner focus ring*/}
            <circle cx="100" cy="100" r="40" fill="url(#logoGradient)" opacity="0.3"></circle>
            {/*Lens highlight*/}
            <path d="M 60 60 Q 100 80 140 60" stroke="white" strokeWidth="6" opacity="0.5" strokeLinecap="round" fill="none"></path>
        </svg>
    )
}