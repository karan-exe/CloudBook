import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SingUp = (props) => {
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" })
    let navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password } = credentials
        const response = await fetch(`http://localhost:5000/api/auth/createuser`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: credentials.name, email: credentials.email, password: credentials.password })

        });
        const json = await response.json();
        console.log(json);
        if (json.success) {
            //Save the auth-token and redirect
            localStorage.setItem('token', json.authtoken)
            navigate("/")
            props.showAlert("Acoount created Successfully", "success")
        }
        else {
            props.showAlert("Invalid Credentials", "danger")
        }
    }

    const onchange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }
    return (
        <div className="container mt-2">
            <h2>Create an acoount to use CloudBook</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Enter Your Name</label>
                    <input type="text" className="form-control" name="name" id="name" value={credentials.name} aria-describedby="emailHelp" onChange={onchange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" name="email" id="email" value={credentials.email} aria-describedby="emailHelp" onChange={onchange} />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" name="password" id="password" value={credentials.password} onChange={onchange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" name="cpassword" id="cpassword" value={credentials.cpassword} onChange={onchange} />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>

        </div>
    )
}

export default SingUp;