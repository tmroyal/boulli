import React from 'react'
import ReactDOM from 'react-dom'
import { CardsetView, CardsetEdit } from './CardsetView' 
import { CardsetListView } from './CardsetListView'
import { Router, Link } from '@reach/router'
import { Header, NavBar } from './NavBars'
import { Logout, SignUpForm, SignInForm, AccountSettings } from './Auth'
import { ErrorPath } from './ErrorPaths'
import { EmailFunctions, ResetPasswordView } from './EmailFunctions'


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
                    <CardsetEdit user={this.state.user} func="new" path="/newcardset" />

                    <CardsetListView type="user" user={this.state.user} path="/mycards" />
                    <CardsetListView type="all" path="/" />

                    <SignUpForm user={this.state.user} path="/signup" />
                    <SignInForm user={this.state.user} path="/signin" />
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
