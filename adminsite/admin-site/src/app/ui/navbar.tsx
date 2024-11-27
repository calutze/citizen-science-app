'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation'

export default function Navbar() {
    const router = useRouter()

    async function handleLogout() {
        // create the request
        const logoutHeader = new Headers();
        logoutHeader.append("Content-Type", "application/json");

        const logoutRequest = new Request("https://capstone-deploy-production.up.railway.app/auth/logout", {
            method: "POST",
            credentials: 'include',
            headers: logoutHeader
        })

        // try to log out the user and return them to the home screen
        try {
            const logoutResponse = await fetch(logoutRequest);
            if (!logoutResponse.ok) {
                throw new Error(`Response status: ${logoutResponse.status}`)
            } else {
                router.push("/")
            }
        } catch (error: any) {
            console.error(error.message)
        }
    }

    return (
        <div className="navbar">
            <Link href="/" className="navButton">Citizen Science App</Link>
            <div className="navbar-actions">
                <Link href="/account" className="navButton">Project Dashboard</Link>
                <button className="logOut" onClick={handleLogout}>Log Out</button>
            </div>
        </div>
    )
}