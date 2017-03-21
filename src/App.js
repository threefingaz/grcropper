import React, { Component } from 'react';
import './App.css';

import Roppe from './components/roppe';

function calculateGoldenRatio(number) {
    return parseInt((number / 1.6180339887).toFixed(), 10);
}

class InputRange extends Component {
    constructor() {
        super();
        this.state = { pixels: 600 };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const value = event.target.value;
        this.setState({ pixels: value});
        this.props.setSize(value);
    }

    render() {
        return <input
            type="range"
            className="pixels-range"
            name="pixels"
            id="pixels-range"
            min="300"
            max="900"
            step="10"
            title={this.state.pixels}
            value={this.state.pixels}
            onChange={this.handleChange} />;
    }
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { width: 0, height: 0 };
        this.setSize = this.setSize.bind(this);
    }

    componentWillMount() {
        this.setState({
            width: 600,
            height: calculateGoldenRatio(600)
        });
    }

    setSize(value) {
        const width = parseInt(value, 10);
        const height = calculateGoldenRatio(width);
        this.setState({ width, height });
    }

    render() {
        return (
            <div className="App">
                <h1 className="title">Golden Ratio Image Cropper</h1>
                <label
                    className="pixels-range-label"
                    htmlFor="pixels-range">
                    Image width
                </label>
                <InputRange setSize={this.setSize}/>
                <Roppe width={this.state.width} height={this.state.height}/>
            </div>
        );
    }
}

export default App;
