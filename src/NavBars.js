import React from 'react'
import { Link } from "@reach/router"


class UserNavbar extends React.Component {
    render (){
       return <p>Logout | My Cards | Create new Cards</p>;
    }
}

class NonUserNavbar extends React.Component {
    render (){
        return (
            <div>
                <Link to="/" className="navLink">Home</Link> 
                <Link to="/signin" className="navLink">Login</Link> 
                <Link to="signup" className="navLink">Sign Up</Link>
            </div>
        );
    }
}

export class NavBar extends React.Component {
    render (){
        let component = this.props.user ? <UserNavbar/> : <NonUserNavbar/>;
        return <nav>{component}</nav>;
    }
}


export class Header extends React.Component {
    render (){
        return (
            <Link to="/">
                <header>
                    <p><span id="sitetitle">Boulli</span><span id="sitesubtitle"> math flashcards</span></p>
                </header>
            </Link>
        );
    }
}



