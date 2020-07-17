import React from 'react'
import ReactDOM from 'react-dom'
import { CardsetView } from './CardsetView' 
import { CardsetListView } from './CardsetListView'
import { Router, Link } from '@reach/router'
import { Header, NavBar } from './NavBars'
import { Logout, SignUpForm, SignInForm, AccountSettings } from './Auth'
import { ErrorPath } from './ErrorPaths'
import { EmailFunctions, ResetPasswordView } from './EmailFunctions'


// DEPLOY AND TEST!!!

(function(){   

    class App extends React.Component {
        constructor(props){
            super(props);
            this.state = {
                user: firebase.auth().currentUser
            }
        }

        componentDidMount (){
            firebase.auth().onAuthStateChanged((user)=>{
                this.setState({
                    user: firebase.auth().currentUser
                });
            });
        }
        
        render (){
            return (
                <>
                <Header/>
                <NavBar user={this.state.user} />
                <Router>
                    <CardsetView path="/cardset/:cardsetId" />
                    <CardsetListView type="user" user={this.state.user} path="/mycards" />
                    <CardsetListView type="all" path="/" />
                    <SignUpForm path="/signup" />
                    <SignInForm path="/signin" />
                    <Logout path="/logout" />
                    <EmailFunctions path="/auth_function/action" />
                    <AccountSettings path="/account" />
                    <ResetPasswordView path="/password_reset" />
                    <ErrorPath path="/error/:error" />
                    <ErrorPath error="notfound" default />
                </Router> 
                </>
            );
        }
    }

    ReactDOM.render(
        <App />,
        document.getElementById("root")
    );
}());
