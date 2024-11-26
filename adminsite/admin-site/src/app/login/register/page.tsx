'use client';

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Register() {
    // This component is the registration form for new users
    const [registerData, setRegisterData] = useState({
        username: "username",
        password: "password",
        email: "email@email.com",
        first_name: "",
        last_name: "",
        school: ""
    })

    const router = useRouter()

    async function handleSubmit(event: any) {
        // stop refresh
        event.preventDefault()

        // create the request
        const registrationHeader = new Headers();
        registrationHeader.append("Content-Type", "application/json");

        const registerRequest = new Request("https://capstone-deploy-production.up.railway.app/auth/register", {
            method: "POST",
            body: JSON.stringify(registerData),
            headers: registrationHeader
        })
    
        // try to contact the server and register the user
        try {
            const registerResponse = await fetch(registerRequest);
            if (!registerResponse.ok) {
                throw new Error(`Response status: ${registerResponse.status}`);
            } else {
                router.push('/login')
            }
        } catch (error: any) {
            console.error(error.message);
        }
    }

    return (
    <div className='register'>
        <h1 className="websiteHeader">Citizen Science App</h1>
        <form onSubmit={handleSubmit}>
            <label>
                Username:
                <input type="text" name="username" value={registerData.username} onChange={(e) => setRegisterData({...registerData, username: e.target.value})} required />
            </label>
            <label>
                Password:
                <input type="password" name="password" value={registerData.password} onChange={(e) => setRegisterData({...registerData, password: e.target.value})} required />
            </label>
            <label>
                Email:
                <input type="email" name="email" value={registerData.email} onChange={(e) => setRegisterData({...registerData, email: e.target.value})} required />
            </label>
            <label>
                First Name &#40;optional&#41;:
                <input type="text" name="first_name" value={registerData.first_name} onChange={(e) => setRegisterData({...registerData, first_name: e.target.value})} />
            </label>
            <label>
                Last Name &#40;optional&#41;:
                <input type="text" name="last_name" value={registerData.last_name} onChange={(e) => setRegisterData({...registerData, last_name: e.target.value})} />
            </label>
            <label>
                School &#40;optional&#41;:
                <input type="text" name="school" value={registerData.school} onChange={(e) => setRegisterData({...registerData, school: e.target.value})} />
            </label>
            <input className="submitButton" type="submit" />
        </form>
    </div>
    )
}