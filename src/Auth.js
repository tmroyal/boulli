import { Link, navigate } from "@reach/router"
import React from 'react'

export class SignUpForm extends React.Component {
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

