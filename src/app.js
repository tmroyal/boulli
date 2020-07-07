import React from 'react'
import ReactDOM from 'react-dom'
import { CardsetView } from './CardsetView' 
import { CardsetListView } from './CardsetListView'
import { Router, Link } from '@reach/router'
import { Header, NavBar } from './NavBars'
import { SignUpForm, SignInForm } from './Auth'

(function(){   
    class App extends React.Component {
        constructor(props){
            super(props);
            this.state = {
                user: null
            }
        }

        componentDidMount (){
            firebase.auth().onAuthStateChanged((user)=>{
                this.setState({
                    user: user
                });
            });
        }
        
        // set user in nav bar
        render (){
            return (
                <>
                <SignUpForm/>
                <Header/>
                <NavBar user={this.state.user} />
                <Router>
                    <CardsetView path="/cardset/:cardsetId" />
                    <CardsetListView path="/cardsetlist/:user" />
                    <CardsetListView path="/" />
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
