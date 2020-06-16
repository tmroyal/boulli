import React from 'react'
import { NavButton, StateButton } from './Buttons' 

class CardView extends React.Component {
   render () {
       return (
           <>
                <h3>{ this.props.card.title }</h3>  
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
    
   titleChanged(event){
       this.props.titleChanged(event.target.value);
   }
    
   textAreaChanged(event){
       this.props.formulaChanged(event.target.value); 
   }
    
   render (){
       const initValue = this.props.showingFront ?
                             this.props.card.front : this.props.card.back;
       const title = this.props.card.title;
       
       return (
           <form className="mui-form">
               <div className="mui-textfield">
                   <input 
                       value={ title }
                       onChange={ this.titleChanged.bind(this) }
                    />
               </div>
               <div className="mui-textfield">
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
                <nav className="mui-row">
                    <StateButton
                        className="mui-btn mui-col-sm-4 mui-col-sm-offset-2"
                        onClick={this.props.toggleVisibleSide}
                        text={this.props.showingFront ? "Front" : "Back"} />
                    <StateButton
                        className="mui-btn mui-col-sm-4"
                        onClick={this.props.toggleEditing}
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
                <div className="mui-row">
                    <div className="mui-panel">
                        <div className="mui--text-center">
                            { component }
                        </div>
                    </div> 
                </div>
            </>
        );
    }
}
