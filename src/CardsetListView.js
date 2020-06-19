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
        // TODO:--------------------- Start here --------------------------
        return (
            <div className="cardsetSelector">
                <span className="cardsetSelectorTitle">{ this.props.cardset.title }</span>  
                <span className="cardsetSelectorDescription">{ this.descriptionString() }</span>
            </div>
        );
    }
}

export class CardsetListView extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            cardsets: {}
        };
    }

    // this will either load all cardsets if no user is specified
    // or will load all public cardsets
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
            <div className="mui-container-fluid">{ elementList }</div>
        );

    };
}

