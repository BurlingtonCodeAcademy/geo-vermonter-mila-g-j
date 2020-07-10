import React from 'react'

class Modal extends React.Component {

    constructor(props) {
        super(props)

        this.state = {

        }
    }


    render() {
        return (
            <div buttonLabel="guess-list">
                <h1>Which County are you in?</h1>
                <h3>There are only 14</h3>
                <div id='county-list'>
                    <button>Addison</button>
                    <button>Bennington</button>
                    <button>Caledonia</button>
                    <button>Chittenden</button>
                    <button>Essex</button>
                    <button>Franklin</button>
                    <button>Grand Isle</button>
                    <button>Lamoille</button>
                    <button>Orange</button>
                    <button>Orleans</button>
                    <button>Rutland</button>
                    <button>Washington</button>
                    <button>Windham</button>
                    <button>Windsor</button>
                </div>
                <button>Cancel</button>
            </div>
        )
    }
}
export default Modal