import { Link, navigate } from "@reach/router"
import React from 'react'
import { useForm } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';


function InputComponent(props){
    return (
        <>
            <label htmlFor={props.name} >{ props.label }: </label>
            <input 
                name={props.name}
                ref={props.registration}
                className={ props.errors[props.name] ? "invalid" : "" } 
                />
            <ErrorMessage errors={props.errors} name={props.name} />
        </>
    );
}

export function SignUpForm(){
    const { register, handleSubmit, watch, errors } = useForm();
    const onSubmit = data => console.log(data);

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
            />
            <InputComponent 
                name="passwordConfirm"
                label="Confirm Password"
                registration={register(passwordConfirmValidation)} 
                errors={ errors }
            />
            <input type="submit" value="Sign Up" />
            <button onClick={ ()=>console.log(watch('displayName')) } >HERE</button>
        </form>
    );
}

export class SignUpFormOld extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            displayName: "",
            email: "",
            emailConfirmation: "",
            password: "",
            passwordConfirmation: ""
        }
    }

    // START HERE
    //https://reactjs.org/docs/forms.html
    // copy past the handleChange(event) function
    handleChange(key,event) {
        let newState = {};
        newState[key] = event.target.value;

        this.setState(newState);
    }

    handleSubmit(e){
        e.preventDefault();
        console.log(this.state);
    }

    render (){
            // write the form, test the basics in localhost
        //                      this will be easy, but will be labor intensive
        //                      and need to style css
            // host
            // ensure new user settings okay
            // make user
        return (
            <form onSubmit={this.handleSubmit.bind(this)}>
                <label>
                    Username:
                    <input 
                        type="text" 
                        name="displayName" 
                        value={this.state.displayName} 
                        onChange={this.handleChange.bind(this,'displayName')} >
                </input>
                </label>
                <label>
                    Email:
                <input 
                    type="text" 
                    name="email"
                    value={this.state.email}
                    onChange={this.handleChange.bind(this, 'email')} >

                </input>
                </label>
                <label>
                    Email Confirmation:
                <input 
                    type="text" 
                    name="emailConfirmation"
                    value={this.state.emailConfirmation}
                    onChange={this.handleChange.bind(this,'emailConfirmation')}
                    ></input>
                </label>
                <label>
                    Password:
                <input 
                    type="password" 
                    name="password"
                    value={this.state.password}
                    onChange={this.handleChange.bind(this,'password')}
                    ></input>
                </label>
                <label>
                    Password confirmation:
                <input 
                    type="password" 
                    name="passwordConfirmation"
                    value={this.state.passwordConfirmation}
                    onChange={this.handleChange.bind(this,'passwordConfirmation')}
                    
                    ></input>
                </label>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}

export class SignInForm extends React.Component {
    // email
    // pw
    // success navigate
    // fail, notify
}

