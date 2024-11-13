'use client';

import { useState } from 'react'
import Link from 'next/link'

export default function Page() {
    // this component is the user login page
    const [email, setEmail] = useState("Email");
    const [password, setPassword] = useState("");

    function handleSubmit(event: any) {
        event.preventDefault()
        let userData = {
            email: email,
            password: password
        }
        // put call to the server here
        console.log(userData)
    }

    return (
    <div className="Login">
        <form onSubmit={handleSubmit}>
            <label>Email:
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
            </label>
            <label>
                Password:
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
            </label>
            <input className="submitButton" type="submit"></input>
            <Link href="/login/register">Not a member? Register here!</Link>
        </form>
    </div>
    )
}