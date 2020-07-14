import { Link, navigate } from "@reach/router"
import React, { useState, useEffect } from 'react'
import queryString from 'query-string'


function ResetPassword(props){
  return (
    <h1>Reset Password</h1>
  );
}

function RecoverEmail(props){
  return (
    <h1>Recovr Email</h1>
  );
}

function VerifyEmail(props){
  return (
    <h1>Verify Email</h1>
  );
}

function getComponent(qs){
  switch (qs.mode){
    case 'resetPassword':
      return <ResetPassword query={ qs } />
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
