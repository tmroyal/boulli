import React from 'react'
import { NavButton, StateButton } from './Buttons' 

class CardView extends React.Component {
   render () {
       return (
           <div className="cardView" onClick={this.props.onClick}>
                <h3>{ this.props.card.title }</h3>  
                <p>{ this.props.showingFront ? 
                    this.props.card.front : this.props.card.back }</p>
           </div>
       );
       
   } 
}

class CardEditor extends React.Component {
   constructor (props){
       super(props);
   }
    
   titleChanged(event){
       this.props.titleChanged(event.target.value);
   }
    
   textAreaChanged(event){
       this.props.formulaChanged(event.target.value); 
   }
    
    // TODO: hide editing button if wrong user
   render (){
       const initValue = this.props.showingFront ?
                             this.props.card.front : this.props.card.back;
       const title = this.props.card.title;
       
       return (
           <form>
               <div> 
                   <input 
                       value={ title }
                       onChange={ this.titleChanged.bind(this) }
                    />
               </div>
               <div>
                   <textarea 
                        value={ initValue }
                        onChange={ this.textAreaChanged.bind(this) } >
                   </textarea>
               </div>
           </form>
       );
   } 
}

class CardViewStateButtons extends React.Component {
        render(){
            return (
                <nav>
                    <StateButton
                        onClick={this.props.toggleVisibleSide}
                        imgsrc={"/img/rotate-" + (this.props.showingFront ? "ccw" : "cw") + ".svg"}
                        text={this.props.showingFront ? "Front" : "Back"} />
                    <StateButton
                        onClick={this.props.toggleEditing}
                        imgsrc={"/img/" + (this.props.editing ? "check-square.svg" : "edit.svg")}
                        text={this.props.editing ? "Done" : "Edit"} />
                </nav>
            );
        }
}

export class CardEditorViewer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            editing: false,
            showingFront: true
        }
    }

    toggleEditing(){
        if (this.state.editing) {
            this.props.saveCard();
        };

        this.setState({
            editing: !this.state.editing
        });
    }

    toggleVisibleSide(){
        this.setState({
            showingFront: !this.state.showingFront
        });

        this.forceUpdate();
    }

    formulaChanged(value){
        var key = this.state.showingFront ? "front" : "back";
        this.props.updateCard(key, value);
    }
titleChanged(value) {
        this.props.updateCard("title", value);
    }

    componentDidUpdate(){
        MathJax.typeset();
    }

    componentDidMount(){
        MathJax.typeset();
    }

    render (){
        var component = !this.state.editing ?
                           <CardView 
                                onClick={this.toggleVisibleSide.bind(this)}
                                card={this.props.card} 
                                showingFront={this.state.showingFront } /> 
                        : <CardEditor 
                                card={this.props.card} 
                                showingFront={this.state.showingFront } 
                                formulaChanged={this.formulaChanged.bind(this)}
                                titleChanged={this.titleChanged.bind(this)} />;

        return (
            <>
                <CardViewStateButtons 
                    editing={this.state.editing}
                    showingFront={this.state.showingFront}
                    toggleEditing={this.toggleEditing.bind(this)}
                    toggleVisibleSide={this.toggleVisibleSide.bind(this)}
                />
                <div className="raised">
                { component }
                </div>
            </>
        );
    }
}
