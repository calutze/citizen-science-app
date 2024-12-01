'use client';

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { API_URL } from '@/constants/api';

export default function Page() {
    // this component is the user login page
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter()

    async function handleSubmit(event: any) {
        // stop refresh and gather data
        event.preventDefault()
        const userData = {
            username: username,
            password: password
        }

        // create the request
        const loginHeader = new Headers();
        loginHeader.append("Content-Type", "application/json");

        const loginRequest = new Request(`${API_URL}/auth/login`, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(userData),
            headers: loginHeader
        })

        // try to contact the server and log the user in
        try {
            const loginResponse = await fetch(loginRequest);
            if (!loginResponse.ok) {
                if (loginResponse.status === 401) {
                    const incorrectPass = document.getElementById('incorrectPass')
                    if (incorrectPass) {
                        incorrectPass.style.display = 'block'
                    }
                }
                throw new Error(`Response status: ${loginResponse.status}`)
            } else {
                router.push('/account')
            }
        } catch(error:any) {
            console.error(error.message)
        }
    }

    return (
    <div className="Login">
        <h1 className="websiteHeader">Citizen Science App</h1>
        <form onSubmit={handleSubmit} className='loginForm'>
            <h3>Account Login</h3>
            <label className="inputLabel">Username 
                <input className="inputBox" type="text" value={username} onChange={(e) => setUsername(e.target.value)}></input>
            </label>
            <label className="inputLabel">
                Password 
                <input className="inputBox" type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
            </label>
            <p id="incorrectPass" style={{display: 'none'}}>Username or password are incorrect</p>
            <button className="submitButton" type="submit">
                Submit
            </button>
            <p>Not a member yet?  <Link href="/login/register" className="registerButton">Register here</Link></p>
        </form>
    </div>
    )
}