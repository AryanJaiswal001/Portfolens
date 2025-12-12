import { useState } from "react"
import {Link} from "react-router-dom"
import Logo from "../components/Logo"
import {Mail,Lock,ArrowRight} from 'lucide-react'

export default function SignInPage()
{
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [error,setError]=useState("")

    const handleSubmit=(e)=>{
        e.preventDefault()

        //Basic validation
        if(!email||!password){
            setError("Please fill in all fields")
            return
        }
        if(!email.includes('@'))
        {
            setError("Please include a valid Email")
            return
        }

        console.log('Sign in attempt',{email,password})
        setError('')

    }
    return(
        <div className="min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-white flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                {/*Logo+back to home*/}
            </div>
        </div>
    )
}