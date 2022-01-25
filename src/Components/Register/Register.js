import { useState } from "react";
import { registerWithEmailAndPassword } from "../../firebaseconfig";
function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    function confirm(){
        if(password !== confirmPassword){
            alert("Passwords are not the same");
        }
        else{
            registerWithEmailAndPassword(name, email, password);
        }
    }

    return(
        <div className="register">
            <div id = "register_container">
                <input 
                 type="text" 
                 id="register_name" 
                 value={name}
                 onChange={(e) => setName(e.target.value)} 
                 placeholder="Name"  
                />

                <input 
                 type="text"
                 id="register_textBox"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 placeholder="Email"
                />

                <input
                 type="password"
                 id="register_textBox"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 placeholder="Password"
                />

                <input
                 type="password"
                 id="register_textBox"
                 onChange={(e) => setConfirmPassword(e.target.value)}
                 placeholder="Confirm Password"
                />

                <button id="register_btn" onClick={confirm}>
                    Confirm
                </button>
            </div>
        </div>
    );
}
export default Register;