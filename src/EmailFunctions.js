import { Link, navigate } from "@reach/router"
import React, { useState, useEffect } from 'react'
import queryString from 'query-string'
import { useForm } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { InputComponent, FormError } from './FormControls';



/* 
 *
 *    Components used to send password email
 *    to the user.
 *
 */

function ResetPasswordForm(props){
  const { register, handleSubmit, watch, errors } = useForm();
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = (data)=>{
    firebase.auth().sendPasswordResetEmail(data.email)
    .then(function(){
        props.onVerify();
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

  return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormError errorMessage={ errorMessage } />

        <p>Enter your email address and press submit.</p>
        <p>An email with password reset instructions will be sent to you.</p>

        <InputComponent 
            name="email" 
            label="Email" 
            registration={register(emailValidation)}
            errors={errors}
        />
        <input type="submit" id="signupButton" value="Reset Password" />

      </form> 
  );

}

// ------------- 

export function ResetPasswordView(){
  const { register, handleSubmit, watch, errors } = useForm();

  const [errorMessage, setErrorMessage] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleVerify = ()=>{
    setEmailSent(true);
  };

  let component; 


  if (emailSent){
    component = (
      <>
        <p>Password reset email will be sent shortly. </p>
        <p>View instructions in the email to reset your password.</p>
      </>
    );
  } else {
    component = <ResetPasswordForm onVerify={handleVerify } />;
  }

  return (
    <>
      <h3>Reset Email Address</h3>
      { component }
    </>
  );
}

/****
 * reset password functions and componentns
 */
 
function ResetPasswordEmailError(props){
  const handleClick = (e)=>{
    e.preventDefault();
    navigate('/password_reset');
  };

  return (
    <>
      <p>{ props.error }</p>
      <p>Click <a href="" onClick={ handleClick }>here</a> to reset your password</p>
    </>
  );
}

function ResetPasswordEmailForm(props){
  const { register, handleSubmit, watch, errors } = useForm();
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = (data)=>{
    firebase.auth().confirmPasswordReset(props.actionCode, data.password).then(function(resp){
      props.onSuccess();
    }).catch(function(error){
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
          return value == watch('password') || 'Passwords must match';
      }
  };

  return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>Enter and verify your new password.</h3>
        <h4>Your email: { props.email }</h4>
        <FormError errorMessage={ errorMessage } />

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

        <input type="submit" id="signupButton" value="Reset Password" />

      </form> 
  );

}

function ResetPasswordEmailSuccess(props){
  const handleClick = ()=>{
    navigate('/signin');
  };

  return (
    <>
      <h3>Success!</h3>
      <p><a href="" onClick={ handleClick }>Click here</a> to sign in.</p>
    </>
  );
}

function ResetPasswordEmailView(props){
  let component;

  const [resetPasswordState, setResetPasswordState] = useState('');
  const [email, setEmail] = useState('');

  const handleSuccess = ()=>{
    setResetPasswordState('success');
  };

  useEffect(()=>{
    firebase.auth().verifyPasswordResetCode(props.query.oobCode).then(function(email){
      setEmail(email);
      setResetPasswordState('form');    
    }).catch(function(error){
      setResetPasswordState('form');    
    });
  },[]);
  
  switch (resetPasswordState){
    case 'form':
      component = <ResetPasswordEmailForm 
                    email={email} 
                    actionCode={props.query.oobCode} 
                    onSuccess={handleSuccess} 
        />;
      break;
    case 'error':
      component = <ResetPasswordEmailError />;
      break;
    case 'success':
      component = <ResetPasswordEmailSuccess />;
      break;
    default:
      component = <p>Loading</p>;
  }
     
  return (
    <>
      <h2>Reset Password</h2>
      { component }
    </>
  );
}

/* -----------------------
 * Recover email functionality
 * -----------------------
 * Firebase allows the client to reset any email changes that are requested
 * through following a link in their email. The below implements this workflow.
 */

function RecoverEmail(props){
  const [recoveryState, setRecoveryState] = useState('Preparing to Recover Email');

  var restoredEmail = null;

  useEffect(()=>{
    firebase.auth().checkActionCode(props.query.oobCode)
    .then(function(info){
      restoredEmail = info.data.email;
      setRecoveryState('Setting email to '+restoredEmail);
      return firebase.auth().applyActionCode(props.query.oobCode);
    })
    .then(function(){
      setRecoveryState('Email set to'+restoredEmail);
      navigate('/logout');
    })
    .catch(function(error){
      setRecoveryState(error.message);
    });
  },[]);

  return (
    <p>{ recoveryState }</p>
  );
}

/****
 * Verify email functionality
 */


function VerifyEmail(props){
  const [verifyState, setVerifyState] = useState('Verifying Email');

  useEffect(()=>{
    firebase.auth().applyActionCode(props.query.oobCode).then(function(resp) {
      navigate('/mycards');
    })
    .catch(function(error){
      setVerifyState(error.message);
    });;
  },[]);

  return (
    <p>{ verifyState }</p>
  );
}

/***
 * Component switcher
 * based on query string mode */


function getComponent(qs){
  switch (qs.mode){
    case 'resetPassword':
      return <ResetPasswordEmailView query={ qs } />
      break;
    case 'recoverEmail':
      return <RecoverEmail query={ qs } />
      break;
    case 'verifyEmail':
      return <VerifyEmail query={ qs } />
      break;
    default:
      return null;
  }
}

export function EmailFunctions(props){
  let component;

  if (props.location && props.location.search){
    let qs = queryString.parse(props.location.search);
    component = getComponent(qs);
  } 

  if (!component){ navigate('/error/badrequest'); }

  return (
    <>{ component }</>
  )
}
