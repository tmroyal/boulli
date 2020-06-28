import React from 'react'

export class NavButton extends React.Component {
    render (){
        return (
            <StateButton 
                imgsrc={this.props.imgsrc}
                text={this.props.text}
                onClick={
                   ()=> this.props.onClick(this.props.direction)
                } />
        );
    }
}

export class StateButton extends React.Component {
    render (){
       return (
           <button className="navButton raised"
               onClick={
                ()=>this.props.onClick() } >
               <img src={this.props.imgsrc} alt={this.props.text} />
               { this.props.text }
           </button>
       );
    }
} 

