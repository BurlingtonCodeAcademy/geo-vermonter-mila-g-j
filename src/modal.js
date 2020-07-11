import React from 'react'

class Modal extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            
        }
    }

    render() {
        return (
            <div buttonlabel="guess-list">
                <h1>Which County are you in?</h1>
                <h3>There are only 14</h3>
                <div id='county-list'>
                    <button id="addison-county">Addison</button>
                    <button id="bennington-county">Bennington</button>
                    <button id="caledonia-county">Caledonia</button>
                    <button id="chittenden-county">Chittenden</button>
                    <button id="essex-county">Essex</button>
                    <button id="franklin-county">Franklin</button>
                    <button id="grand-isle-county">Grand Isle</button>
                    <button id="lamoille-county">Lamoille</button>
                    <button id="orange-county">Orange</button>
                    <button id="orleans-county">Orleans</button>
                    <button id="rutland-county">Rutland</button>
                    <button id="washington-county">Washington</button>
                    <button id="windham-county">Windham</button>
                    <button id="windsor-county">Windsor</button>
                </div>
                <button onClick={this.props.openModal}>Cancel</button>
            </div>
        )
    }
}
export default Modal





//onClick={this.props.countyGuess}