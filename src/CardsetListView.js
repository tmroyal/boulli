const React = require('react');

class CardsetListItem extends React.Component {
    descriptionString(){
        const description = this.props.cardset.description;
        if (description.length > 30){
            return description.substring(0,27)+'\u2026';
        } else {
            return description;
        }
    }

    render (){
        return <li>{ this.props.cardset.title } | { this.descriptionString() }</li>;
    }
}

export class CardsetListView extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            cardsets: {}
        };
    }

    componentDidMount(){
        let ref;
        if (this.props.user){
            ref = firebase.database().ref('/users/'+this.props.user+'/cardsets');
        } else {
            ref = firebase.database().ref(query).orderByChild('public').equalTo(true);
        }

        ref.on('value', (s)=>{
            this.setState({
                cardsets: s.val()
            });
        });
    }

    render(){
        const elementList = Object.keys(this.state.cardsets).map((cardset)=>{
            return <CardsetListItem 
                        key={cardset} 
                        cardset={this.state.cardsets[cardset]} />;
        });

        return (
            <ul>{ elementList }</ul>
        );

    };
}

