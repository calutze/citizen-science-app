import Link from 'next/link'

export default function Navbar() {
    return (
        <div className="navbar">
            <Link href="/">Home</Link>
            <Link href="/login">Login Page</Link>
            <Link href="/account">Accounts Page</Link>
        </div>
    )
}