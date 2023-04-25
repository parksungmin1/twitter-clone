import React , { useState } from "react";
import { authService, firebaseInstance } from "../fBase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
  } from "@firebase/auth";
 
const AuthForm = () => {
    const [password, setPassword] = useState("");
    const [newAccount , setNewAccount ] = useState(true);
    const [error , setError ] = useState("");
    const [email , setEmail] = useState("");

    const toggleAccount = () => setNewAccount(prev => !prev);

    const onChange = (event) => {
        const {target: {name, value},} = event;
        if(name === "email"){
            setEmail(value);
        }else if(name === "password"){
            setPassword(value);
        }
    }

    const onSubmit = async(event) => {
        event.preventDefault();
        let data;
        try{
            if(newAccount){
               data = await createUserWithEmailAndPassword(
                    authService,email, password
                );
            }else{
                data = await signInWithEmailAndPassword(
                    authService,email,password);
            }
            console.log(data);
        }catch(error){
            setError(error.message);
        }
    };
    return (
        <>
            <form onSubmit={onSubmit} className="container">
            <input 
                name="email" 
                type="email" 
                placeholder="Email" 
                required 
                value={email}
                onChange={onChange}
                className="authInput"/>
            <input 
                name="password" 
                type="password" 
                placeholder="Password"
                required 
                value={password}
                onChange={onChange}
                className="authInput"/>

            <input 
                type="submit" 
                value={newAccount ? "Create Account" : "Log In"}
                className="authInput authSubmit"/> 
            {error && <span className="authError">{error}</span>}
        </form>
        <span onClick={toggleAccount} className="authSwitch">
        {newAccount ? "Sign in" : "Create Account"}</span>
     </>
    );
}

export default AuthForm;