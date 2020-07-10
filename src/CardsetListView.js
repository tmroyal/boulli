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
        this.api()
    }

    api(){
        if (this.props.type=="user" && this.props.user){
            this.dbRef = firebase.database().ref('/users/'+this.props.user.uid+'/cardsets');
        } else if (this.props.type=="all") {
            // maybe redirect?
            this.dbRef = firebase.database().ref('/cardsets/').orderByChild('public').equalTo(true);
        }

        if (this.dbRef){
            this.dbRef.on('value', (s)=>{
                this.setState({
                    cardsets: s.val()
                });
            });
        }
    }

    componentDidUpdate(){
        if (this.props.type=="user" && this.props.user){
            if (this.dbRef){ this.dbRef.off('value'); }
            this.api();
        }
    }
    
    componentWillUnmount(){
        if (this.dbRef){ this.dbRef.off('value'); }
    }

    // next, onClick below will call the parent, and the parent will change the component to card
   
    render(){
        const keys = this.state.cardsets ? Object.keys(this.state.cardsets) : [];
        let elementList = keys.map((cardset)=>{
            return <CardsetListItem 
                        key={cardset} 
                        id={cardset}
                        cardset={this.state.cardsets[cardset]} />;
        });
        if (elementList.length == 0){
            elementList = "Loading";
        }

        return (
            <div>{ elementList }</div>
        );

    };
}

