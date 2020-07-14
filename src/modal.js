import React from 'react'

//modal containing county names
class Modal extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            
        }
    }

    render() {
        return (
            <div buttonlabel="guess-list" id="modal-container">
                <h1>Which County are you in?</h1>
                <h3>There are only 14</h3>
                {/* <h3>{this.props.status}</h3> */}
                <div id='county-list'>
                    <button id="addison-county" onClick={this.props.countyGuess}>Addison</button>
                    <button id="bennington-county" onClick={this.props.countyGuess}>Bennington</button>
                    <button id="caledonia-county" onClick={this.props.countyGuess}>Caledonia</button>
                    <button id="chittenden-county" onClick={this.props.countyGuess}>Chittenden</button>
                    <button id="essex-county" onClick={this.props.countyGuess}>Essex</button>
                    <button id="franklin-county" onClick={this.props.countyGuess}>Franklin</button>
                    <button id="grand-isle-county" onClick={this.props.countyGuess}>Grand Isle</button>
                    <button id="lamoille-county" onClick={this.props.countyGuess}>Lamoille</button>
                    <button id="orange-county" onClick={this.props.countyGuess}>Orange</button>
                    <button id="orleans-county" onClick={this.props.countyGuess}>Orleans</button>
                    <button id="rutland-county" onClick={this.props.countyGuess}>Rutland</button>
                    <button id="washington-county" onClick={this.props.countyGuess}>Washington</button>
                    <button id="windham-county" onClick={this.props.countyGuess}>Windham</button>
                    <button id="windsor-county" onClick={this.props.countyGuess}>Windsor</button>
                </div>
                <button onClick={this.props.closeModal}>Cancel</button>
                <h3>{this.props.status}</h3>
            </div>
        )
    }
}
export default Modal





//onClick={this.props.countyGuess}