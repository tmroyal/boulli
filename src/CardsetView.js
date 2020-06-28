import React from 'react'
import { CardEditorViewer } from './CardView'
import { NavButton, StateButton } from './Buttons' 

class CardsetViewNav extends React.Component {

    render (){
        return (
            <nav>
                <NavButton 
                    direction="-1" 
                    onClick={this.props.onNavigate.bind(this,-1)}
                    imgsrc="/img/arrow-left.svg"
                    text="Next" />
                <NavButton 
                    direction="1" 
                    onClick={this.props.onNavigate.bind(this,1)}
                    imgsrc="/img/arrow-right.svg"
                    text="Prev." />
                <StateButton 
                    onClick={this.props.onAddCard}
                    imgsrc="/img/plus-square.svg"
                    text="Add" />
                <StateButton
                    onClick={this.props.onRemoveCard}
                    imgsrc="/img/trash.svg"
                    text="Delete" />
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
            let cards = snapshot.val().cards;
            let keys = Object.keys(cards);

            this.setState({
                cards: cards,
                keys: keys, 
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

    // TODO: when card while editing changed, trigger this method first
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
        let newCard = {
            title: "",
            front: "$$=$$",
            back: "$$=$$"
        }
        // TODO: UI to handle latency
        firebase.database().ref(this.getQuery()+'/cards').push(newCard)
        .then((cardRecord)=>{
            let ind = this.state.keys.indexOf(cardRecord.key);
            if (ind > 0){
                this.setState({
                    index: ind
                });
            }
        });
    }

    removeCard(){
        let currentKey = this.state.keys[this.state.index];       
        if (this.state.keys.length <= 1){ 
            this.addCard(); 
        }
            
        firebase.database().ref(this.getQuery()+'/cards/'+currentKey).remove()
        .then(()=>{
            if (this.state.index > this.state.keys.length - 1){
                this.setState({
                    index: this.state.index - 1
                });
            }
        });
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

