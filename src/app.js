import React from 'react'
import ReactDOM from 'react-dom'
import { CardsetView } from './CardsetView' 
import { CardsetListView } from './CardsetListView'
import { Router, Link } from '@reach/router'
import { Header, NavBar } from './NavBars'
import { Logout, SignUpForm, SignInForm } from './Auth'
import { ErrorPath } from './ErrorPaths'

(function(){   
    class App extends React.Component {
        constructor(props){
            super(props);
            this.state = {
                user: '1a'
            }
        }

        componentDidMount (){
            firebase.auth().onAuthStateChanged((user)=>{
                this.setState({
                    user: '1a'
                });
            });
        }
        
        // set user in nav bar
        render (){
            return (
                <>
                <Header/>
                <NavBar user={this.state.user} />
                <Router>
                    <CardsetView path="/cardset/:cardsetId" />
                    <CardsetListView user={this.state.user} path="/mycards" />
                    <CardsetListView path="/" />
                    <SignUpForm path="/signup" />
                    <SignInForm path="/signin" />
                    <Logout path="/logout" />
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
