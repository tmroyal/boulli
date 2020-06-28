import React from 'react'
import ReactDOM from 'react-dom'
import { CardsetView } from './CardsetView' 
import { CardsetListView } from './CardsetListView'
import { Router, Link } from "@reach/router"


(function(){    
    if (location.hostname === "localhost") {

      var firebaseConfig = {
        databaseURL: "http://localhost:9000?ns=noulli"
      }

      var myApp = firebase.initializeApp(firebaseConfig);
      var db = myApp.database();
    }

    class Header extends React.Component {
        render (){
            return (
                <Link to="/">
                    <header>
                        <p><span id="sitetitle">Noulli</span><span id="sitesubtitle"> math flashcards</span></p>
                    </header>
                </Link>
            );
        }
    }
    
    // site heading, when clicked, goes back to top level
    // top level shows all cardsets
    // top level shows option for my cardsets
    // each card shows option for cardset list
    class App extends React.Component {
        render (){
            return (
                <>
                <Header/>
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
