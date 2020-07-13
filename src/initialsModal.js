import React from 'react'

//modal containing high scores
class InitialsModal extends React.Component {

    constructor(props) {
        super(props)

        this.state = {

        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let initials = JSON.stringify(this.props.value)
        let score = JSON.stringify(this.props.playerScore)
        console.log(Object.entries(localStorage))
        Object.entries(localStorage)
        
       
        window.localStorage.setItem(initials, score)
        {this.props.localStorageState()}

        console.log(window.localStorage)
        console.log(this.props.value)
        console.log(this.props.playerScore)
    }

    handleGetData = () => {
        console.log(window.localStorage.getItem("test"))
    }

    render() {
        return (
            <>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Enter Initials:
          <input type="text" value={this.props.value} onChange={this.props.handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                <button onClick={this.handleGetData}>Get Data</button>
            </>
        )
    }
}
export default InitialsModal