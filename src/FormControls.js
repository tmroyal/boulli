import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';

export function InputComponent(props){
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

export function FormError(props){
    if (props.errorMessage){
        return (
            <div className="formError">{ props.errorMessage }</div>
        );
    } else {
        return "";
    }
}


