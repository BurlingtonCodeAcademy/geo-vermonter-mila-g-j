import React from 'react'

//modal containing high scores
class InitialsModal extends React.Component {

    constructor(props) {
        super(props)

        this.state = {

        }
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Initials:
          <input type="text" value={this.props.value} onChange={this.props.handleChange} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        )
    }
}
export default InitialsModal