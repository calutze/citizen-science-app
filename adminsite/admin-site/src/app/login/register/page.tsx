'use client';

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { API_URL } from '@/constants/api';

export default function Register() {
    // This component is the registration form for new users
    const [registerData, setRegisterData] = useState({
        username: "",
        password: "",
        email: "",
        first_name: "",
        last_name: "",
        school: ""
    })

    const [passwordConfirm, setPasswordConfirm] = useState("");

    const router = useRouter()

    async function handleSubmit(event: any) {
        // stop refresh
        event.preventDefault()

        // create the request
        const registrationHeader = new Headers();
        registrationHeader.append("Content-Type", "application/json");

        const registerRequest = new Request(`${API_URL}/auth/register`, {
            method: "POST",
            body: JSON.stringify(registerData),
            headers: registrationHeader
        })
    
        // try to contact the server and register the user
        try {
            const registerResponse = await fetch(registerRequest);
            if (!registerResponse.ok) {
                if (registerResponse.status === 409) {
                    const passMatch = document.getElementById('passMatch')
                    const userExist = document.getElementById('userExist')
                    if (passMatch && userExist) {
                        passMatch.style.display = 'none'
                        userExist.style.display = 'block'
                    }
                }
                throw new Error(`Response status: ${registerResponse.status}`);
            } else {
                router.push('/login')
            }
        } catch (error: any) {
            console.error(error.message);
        }
    }

    function checkPasswords(event: any) {
        // stop refresh
        event.preventDefault()

        // check if passwords match
        if (registerData.password !== passwordConfirm) {
            const passMatch = document.getElementById('passMatch')
            const userExist = document.getElementById('userExist')
            if (passMatch && userExist) {
                passMatch.style.display = 'block'
                userExist.style.display = 'none'
            }
            return
        } else {
            handleSubmit(event)
        }
    }

    return (
    <div>
        <h1 className="websiteHeader">Citizen Science App</h1>
        <form onSubmit={checkPasswords}>
            <h3>Create Your Account</h3>
            <p>Please fill out the form below to complete your registration.</p>
            <label className='inputLabel'>
                Username
                <input className='inputBox' type="text" name="username" value={registerData.username} onChange={(e) => setRegisterData({...registerData, username: e.target.value})} required />
            </label>
            <label className='inputLabel'>
                Password
                <input className='inputBox' type="password" name="password" value={registerData.password} onChange={(e) => setRegisterData({...registerData, password: e.target.value})} required />
            </label>
            <label className='inputLabel'>
                Password
                <input className='inputBox' type="password" name="passwordConfirm" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)}required />
            </label>
            <label className='inputLabel'>
                Email
                <input className='inputBox' type="email" name="email" value={registerData.email} onChange={(e) => setRegisterData({...registerData, email: e.target.value})} required />
            </label>
            <label className='inputLabel'>
                First Name
                <input className='inputBox' type="text" name="first_name" value={registerData.first_name} onChange={(e) => setRegisterData({...registerData, first_name: e.target.value})} />
            </label>
            <label className='inputLabel'>
                Last Name 
                <input className='inputBox' type="text" name="last_name" value={registerData.last_name} onChange={(e) => setRegisterData({...registerData, last_name: e.target.value})} />
            </label>
            <label className='inputLabel'>
                School &#40;optional&#41;
                <input className='inputBox' type="text" name="school" value={registerData.school} onChange={(e) => setRegisterData({...registerData, school: e.target.value})} />
            </label>
            <p id="passMatch" style={{display: 'none'}}>Passwords do not match</p>
            <p id="userExist" style={{display: 'none'}}>User already exists</p>
            <button className="submitButton" type="submit">
                Submit
            </button>
        </form>
    </div>
    )
}