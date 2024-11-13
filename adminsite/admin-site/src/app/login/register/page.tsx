'use client';

import { useState } from 'react'

export default function Register() {
    // This component is the registration form for new users
    const [registerData, setRegisterData] = useState({
        username: "username",
        password: "password",
        email: "email@email.com",
        firstName: "",
        lastName: "",
        school: ""
    })

    function handleSubmit(event: any) {
        // TODO: connect to the server here
        event.preventDefault()
        console.log(registerData)
    }

    return (
    <div className='register'>
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
                <input type="text" name="first_name" value={registerData.firstName} onChange={(e) => setRegisterData({...registerData, firstName: e.target.value})} />
            </label>
            <label>
                Last Name &#40;optional&#41;:
                <input type="text" name="last_name" value={registerData.lastName} onChange={(e) => setRegisterData({...registerData, lastName: e.target.value})} />
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