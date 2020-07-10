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

function FormError(props){
    if (props.errorMessage){
        return (
            <div className="formError">{ props.errorMessage }</div>
        );
    } else {
        return "";
    }
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

export function SignUpForm(){
    const { register, handleSubmit, watch, errors } = useForm();

    const [errorMessage, setErrorMessage] = useState(0);

    const onSubmit = (data) => {
        firebase.auth().createUserWithEmailAndPassword(data.email, data.password)
        .then(function(user){
            navigate("/mycards");
        })
        .catch(function(error) {
            setErrorMessage(error.message);
        });
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
            <FormError errorMessage={ errorMessage } />
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
    const [errorMessage, setErrorMessage] = useState(0);

    const onSubmit = (data) => {
        firebase.auth().signInWithEmailAndPassword(data.email, data.password)
        .then(function(user){
            navigate("/mycards");
        }).catch(function(error) {
            setErrorMessage(error.message);
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h3>Login</h3>
            <FormError errorMessage={ errorMessage } />
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
}

