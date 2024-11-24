'use client';

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Page() {
    // this component is the user login page
    const [username, setUsername] = useState("Username");
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

        const loginRequest = new Request("https://capstone-deploy-production.up.railway.app/auth/login", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(userData),
            headers: loginHeader
        })

        // try to contact the server and log the user in
        try {
            const loginResponse = await fetch(loginRequest);
            if (!loginResponse.ok) {
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
            <label>Username:
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}></input>
            </label>
            <label>
                Password:
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
            </label>
            <input className="submitButton" type="submit"></input>
            <Link href="/login/register" className="registerButton">Not a member? Register here!</Link>
        </form>
    </div>
    )
}