import { useEffect,useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

/**
 * OAuth Callback Handler
 * 
 * This page handles the redirect from Google OAuth.
 * It extracts the token from URL and stores it.
 * 
 * Flow:
 * 1. Backend redirects here with ?token=xxx
 * 2. We extract the token
 * 3. Store in localStorage
 * 4. Redirect to dashboard
 */

export default function OAuthCallback()
{
    const [searchParams]=useSearchParams();
    const navigate=useNavigate();
    const [status,setStatus]=useState('Processing...');

    useEffect(()=>{
        const token=searchParams.get('token');
        const error=searchParams.get('error');

        if(error){
            setStatus('Authentication failed. Redirecting...');
            setTimeout(()=>{
                navigate('/login?error='+error);
            },2000);
            return;
        }

        if(token){
            //Store the token 
            localStorage.setItem('token',token);
            setStatus('Login successful Redirecting...');

            //Redirect to dashboard
            setTimeout(()=>{
                navigate('/dashboard');
            },1000); 
        }else{
            setStatus('No token recieved. Redirecting...');
            setTimeout(()=>{
                navigate('/login?error=no_token');
            },2000);
        }
    },[searchParams,navigate]);

    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--bg-app)" }}
      >
        <div
          className="p-8 rounded-2xl text-center"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          {/* Loading Spinner */}
          <div
            className="w-12 h-12 mx-auto mb-4 border-4 border-t-transparent rounded-full animate-spin"
            style={{
              borderColor: "var(--accent-purple)",
              borderTopColor: "transparent",
            }}
          />

          <h2
            className="text-xl font-semibold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            {status}
          </h2>
          <p style={{ color: "var(--text-secondary)" }}>
            Please wait while we complete your sign-in.
          </p>
        </div>
      </div>
    );
        
}