import { Link, navigate } from "@reach/router"
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { InputComponent, FormError } from './FormControls';

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

    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = (data) => {
        firebase.auth().createUserWithEmailAndPassword(data.email, data.password)
        .then(function(user){
            user.sendEmailVerification();

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
    const [errorMessage, setErrorMessage] = useState('');

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
            <div id="pwreset"><a href="/password_reset">Forgot password?</a></div>
        </form>
    );
}



function ChangeEmailForm(params){

    const onSubmit = (data) => {
        firebase.auth().currentUser.updateEmail(data.email)
        .then(function(user){
            navigate("/mycards");
        }).catch(function(error) {
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

    return (
      <form>
        <h3>Change Email Address</h3>
        <p>Current Address { props.currentAddress }</p>
        <FormError errorMessage={ errorMessage } />
        <InputComponent 
            name="email" 
            label="Enter New Email Address" 
            registration={register(emailValidation)}
            errors={errors}
        />
        <InputComponent 
            name="emailConfirm"
            label="Confirm New Email Address"
            registration={register(emailConfirmValidation)} 
            errors={ errors }
        />
        <input type="submit" id="signupButton" value="Change Email Address" />
      </form>
    );
}

function ChangePasswordForm(){

    const onSubmit = (data) => {
        firebase.auth().currentUser.reauthenticateWithCredential(data.oldPassword)
        .then(()=>{
          return firebase.auth().currentUser.updatePassword(data.newPassword);
        })
        .then(function(user){
            navigate("/mycards");
        }).catch(function(error) {
            setErrorMessage(error.message);
        });
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
            return value == watch('newPassword') || 'Passwords must match';
        }
    };


    return (
      <form>
        <h3>Change Email Address</h3>
        <p>Current Address { props.currentAddress }</p>
        <FormError errorMessage={ errorMessage } />
          <InputComponent
              name="oldPassword"
              label="Old Password"
              registration={ register({ required: "Please provide your old password"}) }
              errors={errors}
              isPassword="true"
          />
          <InputComponent 
              name="newPassword"
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
        <input type="submit" id="signupButton" value="Change Password" />
      </form>
    );

}

export function AccountSettings(){
  const [emailAddress, setEmailAddress] = useState('');
  
  useEffect(()=>{
    if (!firebase.auth().currentUser){
      navigate('/signin');
    } else {
      setEmailAddress(firebase.auth().currentUser.email);
    }
  });

  return (
    <>
      <ChangeEmailForm currentAddress={ emailAddress } />
      <ChangePasswordForm />
    </>
  );
}
