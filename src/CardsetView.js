import React from 'react'
import { CardEditorViewer } from './CardView'
import { NavButton, StateButton } from './Buttons' 

class CardsetViewNav extends React.Component {

    render (){
        return (
            <nav className="mui-row">
                <NavButton 
                    direction="-1" 
                    className="mui-btn mui-col-sm-2 mui-col-sm-offset-2"
                    onClick={this.props.onNavigate.bind(this,-1)}
                    text="Left" />
                <NavButton 
                    direction="1" 
                    className="mui-btn mui-col-sm-2"
                    onClick={this.props.onNavigate.bind(this,1)}
                    text="Right" />
                <StateButton 
                    className="mui-btn mui-col-sm-2"
                    onClick={this.props.onAddCard}
                    text="+" />
                <StateButton
                    className="mui-btn mui-col-sm-2"
                    onClick={this.props.onRemoveCard}
                    text="-" />
            </nav>
        );
    }
}

export class CardsetView extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            cards: [],
            keys: [],
            index: 0,
        }
    }

    componentDidMount(){
        let query = this.getQuery();

        firebase.database().ref(query).on('value', (snapshot)=>{
            console.log(snapshot.val());
            let cards = snapshot.val().cards;
            let keys = Object.keys(cards);
            let index = 0;

            this.setState({
                cards: cards,
                keys: keys, 
                index: index
            });
        });
    }

    getQuery(){
        return 'cardsets/'+this.props.cardsetId;
    }

    updateCard(key,value){
        let currentCardKey = this.state.keys[this.state.index];
        let newCards = Object.assign(this.state.cards);
        newCards[currentCardKey][key] = value;
        this.setState({
            cards: newCards
        });
    }

    // TODO: when card changed, trigger this method first
    // TODO: when we add a card, trigger this method. (and then push to ensure)
    // TODO: when we remove a card, trigger this method
    // TODO: hide editing button if wrong user
    saveCards(){
        let query = this.getQuery()+'/cards';
        firebase.database().ref(query).set(this.state.cards).then(function(error){
            if (error){ console.error(error); }
        });
    }

    navigateCards(direction){
        let index = (this.state.index + direction); 

        while (index < 0){ 
            index += this.state.keys.length;
        } 
        index %= this.state.keys.length;  

        this.setState({
            index: index
        });
    }
    
    addCard(){
        console.log("add card after current");
    }

    removeCard(){
        console.log("remove current card");
    }
    
    render (){
        let currentCardKey = this.state.keys[this.state.index];
        let currentView = currentCardKey ? 
            <CardEditorViewer 
                card={this.state.cards[currentCardKey]} 
                updateCard={ this.updateCard.bind(this) }
                saveCard={ this.saveCards.bind(this) }
            /> : 
            <></>;
        return (
            <section>
                { currentView }
                <CardsetViewNav 
                    onNavigate={ this.navigateCards.bind(this) }
                    onAddCard={ this.addCard.bind(this) }
                    onRemoveCard={ this.removeCard.bind(this) }
                />
            </section>
        );
    }
}

