import React from 'react'

//modal containing high scores
class HsModal extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            
        }
    }

    render() {
        return (
            <div buttonlabel="guess-list">
                <h1>Highscores</h1>
                <ol>

                </ol>
                <button onClick={this.props.hsCloseModal}>Close</button>
            </div>
        )
    }
}
export default HsModal