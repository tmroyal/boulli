import React from 'react'
import ReactDOM from 'react-dom'
import { CardsetView } from './CardsetView' 

(function(){    
    if (location.hostname === "localhost") {

      var firebaseConfig = {
        // Point to the RTDB emulator running on localhost.
        // In almost all cases the ns (namespace) is your project ID.
        databaseURL: "http://localhost:9000?ns=noulli"
      }

      var myApp = firebase.initializeApp(firebaseConfig);
      var db = myApp.database();
    }
    
    class App extends React.Component {
        render (){
            return (
                <CardsetView cardsetId="1a" />
            );
        }
    }

    ReactDOM.render(
        <App />,
        document.getElementById("root")
    );
}());
