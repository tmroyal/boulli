import React, { useState, useEffect } from 'react';
import { CardEditorViewer } from './CardView'
import { NavButton, StateButton } from './Buttons' 
import { useForm } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { InputComponent, FormError } from './FormControls';
import { Link, navigate } from "@reach/router"

class CardsetViewNav extends React.Component {

    render (){
        return (
            <nav>
                <NavButton 
                    direction="-1" 
                    onClick={this.props.onNavigate.bind(this,-1)}
                    imgsrc="/img/arrow-left.svg"
                    text="Prev." />
                <NavButton 
                    direction="1" 
                    onClick={this.props.onNavigate.bind(this,1)}
                    imgsrc="/img/arrow-right.svg"
                    text="Next" />
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


function CardsetEditForm(props){ 
    const defaultValues = {
      public: true
    };

    const { register, handleSubmit, setValue, watch, errors } = useForm({
      defaultValues: defaultValues
    });

    const [errorMessage, setErrorMessage] = useState('');

    // populate form if in edit mode
    useEffect(()=>{
      if (props.func == "edit" && props.user && props.cardsetId){
        firebase.database().ref('/cardsets/'+props.cardsetId).once('value')
        .then(function(snapshot){
          console.log(snapshot);
          setValue("title", snapshot.val().title);
          setValue("description", snapshot.val().description);
          setValue("public", snapshot.val().public);
        });
      } else {
        console.log("not loaded");
      }
    });

    const submitNew = (record) =>{
      firebase.database().ref('cardsets').push(record)
      .then((ref)=>{
        navigate('/cardset/'+ref.key);
      })
      .catch((error)=>{
        setErrorMessage(error.message);
      });
    };

    const submitEdit = (record) =>{
      firebase.database().ref('cardsets/'+props.cardsetId).set(record)
      .then(()=>{
        navigate('/cardset/'+props.cardsetId);
      })
      .catch((error)=>{
        setErrorMessage(error.message);
      });
    };

    const onSubmit = (data) => {
      const record = {
        public: data.public,
        owner: props.user.uid,
        title: data.title,
        description: data.description, 
      };

      if (props.func == "edit"){
        submitEdit(record);
      } else {
        submitNew(record);
      }
    };

    const functionNameCap = props.func.charAt(0).toUpperCase() + props.func.slice(1);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h3>{ functionNameCap } Card Deck</h3>
            <FormError errorMessage={ errorMessage } />
            <InputComponent
                name="title"
                label="Cardset Title"
                registration={ register({ required: "Please provide a title"}) }
                errors={errors}
            />
            <InputComponent
                name="description"
                label="Description"
                registration={ register({ required: "Please provide a brief description"}) }
                errors={errors}
            />
            <div>
              <label htmlFor="public">Public:</label>
              <input type="checkbox" name="public" ref={register} />
            </div>
            <input type="submit" id="signupButton" value={ functionNameCap + " Deck" } />
        </form>
        // todo: delete button below form
    );
}


export class CardsetEdit extends React.Component {
  
  render (){
    let component;
    if (this.props.user){
      component = <CardsetEditForm 
                      cardsetId={this.props.cardsetId} 
                      user={this.props.user} 
                      func={ this.props.func }/>;
    } else {
      component = <p><Link to="/signin">Sign in</Link> to edit and create cards</p>;
    }
    return component;
  }
}

export class CardsetView extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            cards: [],
            keys: [],
            index: 0,
            showingFront: true
        }
        this.dbRef = null;
    }

    componentDidMount(){
        let query = this.getQuery();

        this.dbRef = firebase.database().ref(query);

        this.dbRef.on('value', (snapshot)=>{
            let cards = snapshot.val().cards || {};
            let keys = Object.keys(cards) || [];

            this.setState({
                cards: cards,
                keys: keys, 
            });
        });
    }

    componentWillUnmount(){
        if (this.dbRef){ this.dbRef.off('value'); }
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
            showingFront: true,
            index: index
        });
    }

    toggleVisibleSide(){
        this.setState({
            showingFront: !this.state.showingFront
        });
    }
    
    addCard(){
        let newCard = {
            title: "",
            front: "1+1",
            back: "=2"
        }

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
                showingFront= {this.state.showingFront} 
                toggleSide={ this.toggleVisibleSide.bind(this) }
            /> : 
            <></>;
        return (
            <section>
                { currentView }
                <CardsetViewNav 
                    showingFront= {this.state.showingFront} 
                    onNavigate={ this.navigateCards.bind(this) }
                    onAddCard={ this.addCard.bind(this) }
                    onRemoveCard={ this.removeCard.bind(this) }
                />
            </section>
        );
    }
}

