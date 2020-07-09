import { Link, navigate } from "@reach/router"
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';

function InputComponent(props){
    return (
        <div>
            <label htmlFor={props.name} >{ props.label }: </label>
            <input 
                name={props.name}
                ref={props.registration}
                className={ props.errors[props.name] ? "invalid" : "" } 
                type = { props.isPassword ? "password" : "text" }
                />
            <div className="errorMessage"><ErrorMessage errors={props.errors} name={props.name} /></div>
        </div>
    );
}

export function Logout(){
    useEffect(()=>{
        firebase.auth().signOut().then(function(){
            navigate('/');
        }).catch(function(){
            navigate('/error/logout');
        });
    });

    return (
        <h1>Logging out</h1>
    );
}

// ******************8 TODO!!!!! ********************
// ******************8 TODO!!!!! ********************
// ******************8 TODO!!!!! ********************
// ******************8 TODO!!!!! ********************
// start blindly implementing login functions from
// https://firebase.google.com/docs/auth/web/password-auth
// ******************8 TODO!!!!! ********************
// ******************8 TODO!!!!! ********************
// ******************8 TODO!!!!! ********************

export function SignUpForm(){
    const { register, handleSubmit, watch, errors } = useForm();

    const onSubmit = (data) => {
        firebase.auth().createUserWithEmailAndPassword(data.email, data.password)
            .then(function(result) {
                return result.user.updateProfile({
                    displayName: document.getElementById("name").value
                })
            }).catch(function(error) {
                console.log(error);
            });
        };

    const displayNameValidation = {
        required: 'Username is required',
        minLength: {
            value: 4,
            message: 'Username must be between 4 and 32 characters'
        },
        maxLength: {
            value: 32, 
            message: 'Username must be between 4 and 32 characters'
        }
    };

    const emailValidation = {
        required: 'Email address is required', 
        pattern: {
            value: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
            message: 'Email address is invalid'
        }

    };

    const emailConfirmValidation = {
        required: 'Email confirmation required',
        validate: (value)=>{
            return value == watch('email') || 'Email addresses must match';
        }
    };

    const passwordValidation = {
        required: 'Password required',
        minLength: {
            value: 8,
            message: 'Password must be between 8 and 256 characters'
        },
        maxLength: {
            value: 256,
            message: 'Password must be between 8 and 256 characters'
        }
    };

    const passwordConfirmValidation = {
        required: 'Password confirmation required',
        validate: (value)=>{
            return value == watch('password') || 'Passwords must match';
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h3>Sign up to create and save cards</h3>
            <InputComponent 
                name="displayName" 
                label="Username" 
                registration={register(displayNameValidation)}
                errors={errors}
            />
            <InputComponent 
                name="email" 
                label="Email" 
                registration={register(emailValidation)}
                errors={errors}
            />
            <InputComponent 
                name="emailConfirm"
                label="Confirm Email"
                registration={register(emailConfirmValidation)} 
                errors={ errors }
            />
            <InputComponent 
                name="password"
                label="Password"
                registration={register(passwordValidation)} 
                errors={ errors }
                isPassword="true"
            />
            <InputComponent 
                name="passwordConfirm"
                label="Confirm Password"
                registration={register(passwordConfirmValidation)} 
                errors={ errors }
                isPassword="true"
            />
            <input type="submit" id="signupButton" value="Sign Up" />
        </form>
    );
}

export function SignInForm(){ 
    const { register, handleSubmit, watch, errors } = useForm();
    const onSubmit = data => console.log(data);

      
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h3>Login</h3>
            <InputComponent
                name="email"
                label="Email Address"
                registration={ register({ required: "Please provide your email address"}) }
                errors={errors}
            />
            <InputComponent
                name="password"
                label="Password"
                registration={ register({ required: "Please provide your password"}) }
                errors={errors}
                isPassword="true"
            />
            <input type="submit" id="signupButton" value="Sign In" />
            <div id="pwreset"><a href="pwreset">Forgot password?</a></div>
        </form>
    );
    // email
    // pw
    // success navigate
    // fail, notify
    // forgot password link
}

