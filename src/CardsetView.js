import React from 'react'
import { CardEditorViewer } from './CardView'

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
    // TODO: hide editing button if wrong user
    saveCards(){
        let query = this.getQuery()+'/cards';
        firebase.database().ref(query).set(this.state.cards).then(function(error){
            if (error){ console.error(error); }
        });
    }
    
    // in this class will be the ui for changing cards
    render (){
        let currentCardKey = this.state.keys[this.state.index];
        let currentView = currentCardKey ? 
            <CardEditorViewer 
                card={this.state.cards[currentCardKey]} 
                updateCard={ this.updateCard.bind(this) }
                saveCard={ this.saveCards.bind(this) }
            /> : 
            <></>;
        return currentView;
    }
}

