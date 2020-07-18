import React from 'react'

export class NavButton extends React.Component {
    render (){
        return (
            <StateButton 
                className = {this.props.className}
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
           <button className={this.props.className + " navButton raised"}
               onClick={
                (e)=>this.props.onClick(e) } >
               <img src={this.props.imgsrc} alt={this.props.text} />
               { this.props.text }
           </button>
       );
    }
} 

