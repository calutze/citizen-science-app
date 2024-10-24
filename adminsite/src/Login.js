import { useState } from 'react';
import ReactDOM from 'react-dom/client';

function Login() {
    const [email, setEmail] = useState("Email");
    const [password, setPassword] = useState("");

    function handleSubmit(event) {
        event.preventDefault()
        let userData = {
            email: email,
            password: password
        }
        console.log(userData)
        // this is where the post request goes
    }

    return(
        <div className="Login">
            <form onSubmit={handleSubmit}>
                <label>Email:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                </label>
                <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                </label>
                <input type="submit" onClick={handleSubmit}></input>
            </form>
        </div>
    );
}

export default Login;