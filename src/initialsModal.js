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
        let key = window.localStorage.length.toString()
        let nameScore = `{name: ${this.props.value}, score: ${this.props.playesScore}}`
        window.localStorage.setItem(key, nameScore)
        console.log(window.localStorage)
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