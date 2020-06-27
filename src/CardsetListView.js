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
                <div className="cardsetSelector">
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
    }

    // this will either load all cardsets if no user is specified
    // or will load all public cardsets
    componentDidMount(){
        let ref;
        if (this.props.user){
            ref = firebase.database().ref('/users/'+this.props.user+'/cardsets');
        } else {
            ref = firebase.database().ref(query).orderByChild('public').equalTo(true);
        }

        ref.on('value', (s)=>{
            this.setState({
                cardsets: s.val()
            });
        });
    }
    

    // next, onClick below will call the parent, and the parent will change the component to card
   
    render(){
        const elementList = Object.keys(this.state.cardsets).map((cardset)=>{
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

