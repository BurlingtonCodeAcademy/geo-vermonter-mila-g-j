import React from 'react'

//modal containing high scores
class HsModal extends React.Component {

    constructor(props) {
        super(props)

        this.state = {

        }
    }

    render() {
        console.log(this.props.scores)
        return (
            <div buttonlabel="guess-list">
                
                <h1>Highscores</h1>
                <ol>
                {this.props.scores.map((item, index) => (
                    <li>Name:{JSON.parse(item[0])} Score:{item[1]}</li>
                ))}

                </ol>
                <button onClick={this.props.hsCloseModal}>Close</button>
            </div>
        )
    }
}
export default HsModal