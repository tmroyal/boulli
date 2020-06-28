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

    
    class App extends React.Component {
        render (){
            return (
                <>
                <Router>
                    <CardsetView path="/cardset/:cardsetId" />
                    <CardsetListView path="/cardsetlist/:user" />
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
