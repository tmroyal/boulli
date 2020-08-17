import React from 'react'
import { NavButton, StateButton } from './Buttons' 

class CardView extends React.Component {
   render () {
       return (
           <div className="cardView" onClick={this.props.onClick}>
                <h3>{ this.props.card.title || "--" }</h3>  
                <p>
           { "$$"+(this.props.showingFront ? 
                    this.props.card.front : this.props.card.back)+"$$" }</p>
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
    
   frontChanged(event){
       this.props.formulaChanged("front", event.target.value); 
   }

   backChanged(event){
       this.props.formulaChanged("back", event.target.value); 
   }
    
    // TODO: hide editing button if wrong user
   render (){
       const frontValue = this.props.card.front;
       const backValue = this.props.card.back;
       const title = this.props.card.title;
       
       return (
           <form className="cardEdit">
                   <label htmlFor="cardTitle">Title: </label>
                   <input 
                       name="cardTitle"
                       value={ title }
                       onChange={ this.titleChanged.bind(this) }
                    />
                   <label htmlFor="frontFormula">Front: </label>
                   <input 
                       name="frontFormula"
                        value={ frontValue }
                        onChange={ this.frontChanged.bind(this) } />
                   <label htmlFor="backFormula">Back: </label>
                   <input 
                       name="backFormula"
                        value={ backValue }
                        onChange={ this.backChanged.bind(this) } />
           </form>
       );
   } 
}

class CardViewStateButtons extends React.Component {
        render(){
            let editbutton;
            if (this.props.editable){
              editbutton = <StateButton
                  onClick={this.props.toggleEditing}
                  imgsrc={"/img/" + (this.props.editing ? "check-square.svg" : "edit.svg")}
                  text={this.props.editing ? "Done" : "Edit"} />
            } else {
              editbutton = ''
            }

            return (
                <nav>
                    <StateButton
                        onClick={this.props.toggleVisibleSide}
                        imgsrc={"/img/rotate-" + (this.props.showingFront ? "ccw" : "cw") + ".svg"}
                        text={this.props.showingFront ? "Front" : "Back"} />
                    {editbutton}
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
        this.props.toggleSide();
        this.forceUpdate();
    }

    formulaChanged(key, value){
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

    componentWillUnmount(){
        if (this.state.editing){
            this.props.saveCard();
        }
    }

    render (){
        var component = !this.state.editing ?
                           <CardView 
                                onClick={this.toggleVisibleSide.bind(this)}
                                card={this.props.card} 
                                showingFront={this.props.showingFront } /> 
                        : <CardEditor 
                                card={this.props.card} 
                                showingFront={this.props.showingFront } 
                                formulaChanged={this.formulaChanged.bind(this)}
                                titleChanged={this.titleChanged.bind(this)} />;

        return (
            <>
                <CardViewStateButtons 
                    editable={this.props.editable}
                    editing={this.state.editing}
                    showingFront={this.props.showingFront}
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
