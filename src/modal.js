import React from 'react';


class Modal extends React.Component {


    render() {
        return (
            <div buttonLabel="guess-list">
                <h1>Which County are you in?</h1>
                <h3>There are only 14</h3>
                <div id='county-list'>
                    <div>Addison</div>
                    <div>Bennington</div>
                    <div>Caledonia</div>
                    <div>Chittenden</div>
                    <div>Essex</div>
                    <div>Franklin</div>
                    <div>Grand Isle</div>
                    <div>Lamoille</div>
                    <div>Orange</div>
                    <div>Orleans</div>
                    <div>Rutland</div>
                    <div>Washington</div>
                    <div>Windham</div>
                    <div>Windsor</div>
                </div>
            </div>
        )
    }
}


export default Modal