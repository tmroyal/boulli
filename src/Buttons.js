import React from 'react'

export class NavButton extends React.Component {
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

export class StateButton extends React.Component {
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

