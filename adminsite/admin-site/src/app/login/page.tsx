'use client';

import { useState } from 'react'

export default function Page() {
    const [email, setEmail] = useState("Email");
    const [password, setPassword] = useState("");

    function handleSubmit(event: any) {
        event.preventDefault()
        let userData = {
            email: email,
            password: password
        }
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
            <input type="submit"></input>
        </form>
    </div>
    )
}