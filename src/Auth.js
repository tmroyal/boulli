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
    },[]);

    return (
        <h1>Logging out</h1>
    );
}

export function SignUpForm(props){
    const { register, handleSubmit, watch, errors } = useForm();

    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = (data) => {
        firebase.auth().createUserWithEmailAndPassword(data.email, data.password)
        .then(function(result){
            result.user.sendEmailVerification();
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

    useEffect(()=>{
      if (props.user){
        navigate('/mycards');
      }
    });

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

export function SignInForm(props){ 
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

    useEffect(()=>{
      if (props.user){
        navigate('/mycards');
      }
    });

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



function ChangeEmailForm(props){
    const { register, handleSubmit, watch, errors } = useForm();
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = (data) => {
        const credential = firebase.auth.EmailAuthProvider.credential(
          firebase.auth().currentUser.email,
          data.password 
        );

        firebase.auth().currentUser.reauthenticateWithCredential(credential)
        .then(()=>{
          return firebase.auth().currentUser.updateEmail(data.email);
        })
        .then(function(user){
          navigate('/mycards');
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
      <form onSubmit={ handleSubmit(onSubmit) }>
        <h4>Change Email Address</h4>
        <p>Current address: { props.currentAddress }</p> 
        <FormError errorMessage={ errorMessage } />
        <InputComponent
            name="password"
            label="Password"
            registration={ register({ required: "Please provide your password"}) }
            errors={errors}
            isPassword="true"
        />
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
        <input type="submit" id="signupButton" value="Change Email" />
      </form>
    );
}

function ChangePasswordForm(props){
    const { register, handleSubmit, watch, errors } = useForm();
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = (data) => {
        const credential = firebase.auth.EmailAuthProvider.credential(
          firebase.auth().currentUser.email,
          data.oldPassword 
        );

        firebase.auth().currentUser.reauthenticateWithCredential(credential)
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
      <form onSubmit={ handleSubmit(onSubmit) }>
        <h4>Change Password</h4>
        <FormError errorMessage={ errorMessage } />
          <InputComponent
              name="oldPassword"
              label="Verify old Password"
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

export function DeleteAccountForm(props){
  const [error, setError] = useState('');
  const { register, handleSubmit, watch, errors } = useForm();

  const onSubmit = (data)=>{
    const credential = firebase.auth.EmailAuthProvider.credential(
      firebase.auth().currentUser.email,
      data.password 
    );

    firebase.auth().currentUser.reauthenticateWithCredential(credential)
    .then(function(){
      return firebase.database().ref('/cardsets/')
        .orderByChild('owner').equalTo(firebase.auth().currentUser.uid)
        .once("value", (snapshot)=>{
          snapshot.forEach((cs)=>{
            cs.ref.remove();
          });
        })
    })
    .then(function(){
      return firebase.auth().currentUser.delete();
    })
    .then(()=>{
      navigate('/'); 
    })
    .catch((error)=>{
      setError(error.message); 
    });
  }

  return (
    <form onSubmit={ handleSubmit(onSubmit) }>
      <h3>Delete Account?</h3>
      <p>Are you sure you want to delete your account? This will permanently delete your account and all associated card sets.</p>
      <InputComponent
          name="password"
          label="Enter Password to Confirm"
          registration={ register({ required: "You must supply password to delete your account."}) }
          errors={errors}
          isPassword="true"
      />
      <input type="submit" id="signupButton" value="Confirm Account Delete" />
    </form>
  );
}



export function AccountSettings(){
  const [emailAddress, setEmailAddress] = useState('');
  
  useEffect(()=>{
    if (firebase.auth().currentUser){
      setEmailAddress(firebase.auth().currentUser.email);
    }
  });

  return (
    <>
      <ChangeEmailForm currentAddress={ emailAddress } />
      <ChangePasswordForm />
      <div id="deleteAccountBox">
        <p>Click here to <Link to="/deleteaccount">Delete Your Account</Link></p>
      </div>
    </>
  );
}
