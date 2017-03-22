import React, {Component} from 'react';

import Dropzone from 'react-dropzone';
import Cropper from './Cropper';

import './roppe.css';

class Roppe extends Component {
    constructor(props) {
        super();

        this.state = {
            src: false,
            croppedImage: false
        };

        this.setPreview = this.setPreview.bind(this);
        this.clearImage = this.clearImage.bind(this);
        this.setCroppedImage = this.setCroppedImage.bind(this);
        this.poseImage = this.poseImage.bind(this);
        this.drawCropper = this.drawCropper.bind(this);
    }

    componentWillMount() {
        this.setState({
            size: {
                width: this.props.width,
                height: this.props.height
            }
        });
    }

    setPreview(blob) {
        this.setState({ src: blob });
    }

    setCroppedImage(url) {
        this.setState({ croppedImage: url });
    }

    clearImage() {
        this.setState({
            src: false,
            is_loaded: false,
            croppedImage: false
        });
    }

    poseImage(coords) {
        this.img_element.style.top = `${coords.top}px`;
        this.img_element.style.left = `${coords.left}px`;
    }

    drawCropper() {
        this.setState({ is_loaded: true });
    }

    render() {
        const { src } = { ...this.state };
        const classes = () => {
            const from_props = this.props.className ? `${this.props.className} ` : ``;
            const from_state = src ? `roppe__cropper` : `roppe__dropper`;

            return `${from_props}${from_state}`;
        };
        const dropper = <Dropzone
                            className="drop-area"
                            activeClassName="drop-area__active"
                            onDrop={ (files) => this.setPreview(files[0].preview) }
                            multiple={ false }
                            accept="image/*,.png,.gif,.jpg">
                            { this.props.instruction }
                        </Dropzone>;
        const image = <img alt="Original"
                           className="img-original"
                           onLoad={ () => this.drawCropper() }
                           ref={ img => this.img_element = img }
                           src={ src } />;
        const cropper = <Cropper
                            width={this.props.width}
                            height={this.props.height}
                            img_element={ this.img_element }
                            setImage={ this.setCroppedImage }
                            poseImage={ this.poseImage } />;
        const download = <a className="btn btn__download"
                            href={this.state.croppedImage}
                            type="button">
                            <span className="btn-icon">
                                ⬇
                            </span>
                            &nbsp;Download
                        </a>;
        const clear = <button className="btn btn__clear"
                              type="button"
                              onClick={ this.clearImage }>
                            ×
                      </button>;

        return (
            <div className={`roppe ${classes()}`}
                 style={{
                     width: `${ this.props.width }px`,
                     height: `${ this.props.height }px`
                 }}>
                { this.state.croppedImage ? download : null }
                { this.state.is_loaded ? clear : null }
                { this.state.src ? image : dropper }
                { this.state.is_loaded ? cropper : null }
            </div>
        );
    }
}

Roppe.defaultProps = {
    width: 800,
    height: 600,
    instruction: 'Drop image file here, or click to select'
};

export default Roppe;