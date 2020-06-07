import React from 'react'
import ReactDOM from 'react-dom'

class Card {
   constructor (id, name, front, back){
       this.id = id;
       this.name = name;
       this.front = front;
       this.back = back;
   } 
    
   static copy(card){
       return Object.assign({}, card);
   }
}

class CardStack {
    constructor(){
        this.cards = [];
        this.currentId = 0;
    }
    
    addCard (name, front, back){
        this.currentId += 1;
        this.cards.push(new Card(this.currentId, name, front, back));
        return this.cards.length - 1;
    }
    
    editCardSide (index, isFront, value){
        const cardRef = this.cards[index];
        if (isFront){
            cardRef.front = value;
        } else {
            cardRef.back = value;
        }
    }
    
    editName (index, newName){
        const cardRef = this.cards[index];
        cardRef.name = newName;
    }
    
    removeCard (index){
        this.cards.splice(index, 1); 
        return index == 0 ? index : index - 1;
    }
    
    getCard (index){
        return Card.copy(this.cards[index]) 
    }
    
    numCards (){
        return this.cards.length;
    }
    
}

let cards = new CardStack;
cards.addCard("Euler's Identity", "$$e^{i\\theta}$$", "$$cos(\\theta)+i\\sin(\\theta)$$");
cards.addCard("Sine Double Angle Identity", "$$\\sin(2\\theta)$$", "$$2\\sin(\\theta)\\cos(\\theta)$$");



(function () {
    'use strict';
    
    class CardView extends React.Component {
       render () {
           return (
               <>
                    <h3>{ this.props.card.name }</h3>  
                    <p className="mui--text-display2">{ this.props.showingFront ? 
                        this.props.card.front : this.props.card.back }</p>
               </>
           );
           
       } 
    }
    
    class CardEditor extends React.Component {
       constructor (props){
           super(props);
       }
        
       nameChange(event){
           this.props.nameChange(event.target.value);
       }
        
       textAreaChange(event){
           this.props.formulaChange(event.target.value); 
       }
        
       render (){
           const initValue = this.props.showingFront ?
                                 this.props.card.front : this.props.card.back;
           const name = this.props.card.name;
           
           return (
               <form className="mui-form">
                   <div className="mui-textfield">
                       <input 
                           value={ name }
                           onChange={ this.nameChange.bind(this) }
                        />
                   </div>
                   <div className="mui-textfield">
                       <textarea 
                            value={ initValue }
                            onChange={ this.textAreaChange.bind(this) } >
                       </textarea>
                   </div>
               </form>
           );
       } 
    }
    
    class CardComponent extends React.Component {
        render (){
            var editing = this.props.editing ? "editing" : "not editing";
            var component = !this.props.editing ?
                               <CardView 
                                    card={this.props.card} 
                                    showingFront={this.props.showingFront } /> 
                            : <CardEditor 
                                    card={this.props.card} 
                                    showingFront={this.props.showingFront } 
                                    formulaChange={this.props.formulaChange}
                                    nameChange={this.props.nameChange} />;
            return (
                <div className="mui-row">
                    <div className={ this.props.className }>
                        <div className="mui--text-center">

                            { component }
                        </div>
                    </div> 
                </div>
            );
        }
        
    }
    
    class NavButton extends React.Component {
        render (){
            return (
                <StateButton 
                    className={this.props.className }
                    text={this.props.text}
                    onClick={
                       ()=> this.props.onClick(this.props.direction)
                    } />
            );
        }
    }
    
    class StateButton extends React.Component {
        render (){
           return (
               <button className={ this.props.className }
                   onClick={
                    ()=>this.props.onClick() }>
                   { this.props.text }
               </button>
           );
        }
    } 
 
    class App extends React.Component {
 
        constructor (props){
            super(props);
            this.state = {
                currentCardInd: 0,
                showingFront: true,
                editing: false
            }
        }
        
        typeset(){
            MathJax.typeset();
        }
    
        addCard(){
            const newIndex = cards.addCard("default", "default"); 
            this.setState({
                currentCardInd: newIndex
            });
        }
        
        removeCard(){
            let currentInd = this.state.currentCardInd;
            
            currentInd = cards.removeCard(currentInd);
            this.setState( {
                currentCardInd: currentInd
            });
        }
        
        toggleEditingMode(){
            this.setState({
                editing: !this.state.editing
            });
        }
        
        toggleVisibleSide(){
            this.setState({
                showingFront: !this.state.showingFront  
            });
        }

        navigateCards(direction){
            
            let newIndex = ( this.state.currentCardInd 
              + parseInt(direction) );
            
            const numCards = cards.numCards();
            
            newIndex = ((newIndex % numCards) 
                            + numCards) % numCards;
            
            this.setState({
                currentCardInd: newIndex
            });
        }

        cardEdited(value){
            cards.editCardSide(
                this.state.currentCardInd, 
                this.state.showingFront, 
                value);
            this.forceUpdate();
        }
        
        nameEdited(value){
            cards.editName(
                this.state.currentCardInd, value);
            this.forceUpdate();
        }
        
        componentDidUpdate(){
            this.typeset();
        }
        
        render (){
            const currentCard = cards.getCard(this.state.currentCardInd);
            
            return (
                <section>
                    <nav className="mui-row">
                        <StateButton
                            className="mui-btn mui-col-sm-4 mui-col-sm-offset-2"
                            onClick={this.toggleVisibleSide.bind(this)}
                            text={this.state.showingFront ? "Front" : "Back"} />
                        <StateButton
                            className="mui-btn mui-col-sm-4"
                            onClick={this.toggleEditingMode.bind(this)}
                            text={this.state.editing ? "Done" : "Edit"} />
                    </nav>

                    <CardComponent
                        className="mui-panel"
                        card={ currentCard } 
                        showingFront={this.state.showingFront}
                        editing={this.state.editing} 
                        formulaChange={this.cardEdited.bind(this)}
                        nameChange={this.nameEdited.bind(this)}
                    />
                            
                    <nav className="mui-row">
                        <NavButton 
                            direction="-1" 
                            className="mui-btn mui-col-sm-2 mui-col-sm-offset-2"
                            onClick={this.navigateCards.bind(this)} 
                            text="Left" />
                        <NavButton 
                            direction="1" 
                            className="mui-btn mui-col-sm-2"
                            onClick={this.navigateCards.bind(this)} 
                            text="Right" />
                        <StateButton 
                            className="mui-btn mui-col-sm-2"
                            onClick={this.addCard.bind(this)}
                            text="+" />
                        <StateButton
                            className="mui-btn mui-col-sm-2"
                            onClick={this.removeCard.bind(this)}
                            text="-" />
                    </nav>
                </section>
            );
        }
    }
    
    
    ReactDOM.render(
        <App />,
        document.getElementById("root")
    );
    MathJax.typeset();
}());
