import React from 'react'
import { Link } from "@reach/router"


class CardsetListItem extends React.Component {
    descriptionString(){
        const description = this.props.cardset.description;
        if (description.length > 30){
            return description.substring(0,27)+'\u2026';
        } else {
            return description;
        }
    }

    render (){
        return (
            <>
                <Link className="routerLink" to={"/cardset/" + this.props.id }>
                <div className="raised cardsetSelector">
                    <span className="cardsetSelectorTitle">{ this.props.cardset.title }</span>  
                    <span className="cardsetSelectorDescription">{ this.descriptionString() }</span>
                </div>
                </Link>
            </>
        );
    }
}

export class CardsetListView extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            cardsets: {}
        };
        this.dbRef = null;
    }

    // this will either load all cardsets if no user is specified
    // or will load all public cardsets
    componentDidMount(){
        if (this.props.user){
            this.dbRef = firebase.database().ref('/users/'+this.props.user+'/cardsets');
        } else {
            this.dbRef = firebase.database().ref('/cardsets/').orderByChild('public').equalTo(true);
        }

        this.dbRef.on('value', (s)=>{
            this.setState({
                cardsets: s.val()
            });
        });
    }
    
    componentWillUnmount(){
        if (this.dbRef){ this.dbRef.off('value'); }
    }

    // next, onClick below will call the parent, and the parent will change the component to card
   
    render(){
        const keys = this.state.cardsets ? Object.keys(this.state.cardsets) : [];
        const elementList = keys.map((cardset)=>{
            return <CardsetListItem 
                        key={cardset} 
                        id={cardset}
                        cardset={this.state.cardsets[cardset]} />;
        });

        return (
            <div>{ elementList }</div>
        );

    };
}

