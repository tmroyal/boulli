import React from 'react'
import { navigate, Link } from "@reach/router"
import { StateButton } from './Buttons' 


class CardsetListItem extends React.Component {
    descriptionString(){
        const description = this.props.cardset.description;
        if (description.length > 30){
            return description.substring(0,27)+'\u2026';
        } else {
            return description;
        }
    }

    editCardset(e){
      navigate("/editcardset/"+this.props.id);
    }

    deleteCardset(e){
    }

    render (){
        return (
            <>
                <div className="raised cardsetSelector">
                  <Link className="routerLink" to={"/cardset/" + this.props.id }>
                      <span className="cardsetSelectorTitle">{ this.props.cardset.title }</span>  
                      <span className="cardsetSelectorDescription">{ this.descriptionString() }</span>
                </Link>
                  <StateButton 
                      className="cardsetListButton"
                      onClick={this.deleteCardset.bind(this)}
                      imgsrc="/img/trash.svg"
                      text="" />
                  <StateButton 
                      className="cardsetListButton"
                      onClick={this.editCardset.bind(this)}
                      imgsrc="/img/edit.svg"
                      text="" />
              </div>
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
            this.dbRef = firebase.database().ref('/cardsets/')
                          .orderByChild('owner').equalTo(this.props.user.uid);
        } else if (this.props.type=="all") {
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
        if (this.props.type=="user" && this.props.user && !this.dbRef){
            this.api();
        }
    }
    
    componentWillUnmount(){
        if (this.dbRef){ this.dbRef.off('value'); }
    }

   
    render(){
        const keys = this.state.cardsets ? Object.keys(this.state.cardsets) : [];
        let elementList = keys.map((cardset)=>{
            return <CardsetListItem 
                        key={cardset} 
                        id={cardset}
                        cardset={this.state.cardsets[cardset]} />;
        });
        if (elementList.length == 0){
            elementList = "No cards to show yet.";
        }

        return (
            <div>{ elementList }</div>
        );

    };
}

