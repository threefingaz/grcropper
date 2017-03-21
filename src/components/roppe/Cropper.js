import React, { Component } from 'react';

class Cropper extends Component {
    constructor() {
        super();

        this.state = {
            cropping:   false,
            img_size:   { width: 0, height: 0 },
            delta:      { top: 0, left: 0 },
            canvas:     { top: 0, left: 0 },
            offset:     { top: 0, left: 0 }
        };

        this.draw = this.draw.bind(this);
        this.crop = this.crop.bind(this);
        this.startCropping = this.startCropping.bind(this);
        this.stopCropping = this.stopCropping.bind(this);
    }

    componentDidMount() {
        let state = {...this.state};

        state.img_size.width = this.props.img_element.width;
        state.img_size.height = this.props.img_element.height;

        this.setState(state);
        this.draw();
        this.props.setImage(this.canvas.toDataURL());
    }

    componentDidUpdate() {
        this.draw();
    }

    draw() {
        const ctx = this.canvas.getContext('2d');
        const img_size = { ...this.state.img_size };
        const offset = { ...this.state.offset };

        ctx.clearRect(0, 0, this.props.width, this.props.height);

        ctx.drawImage(
            // image,
            this.props.img_element,
            // sx, sy, sWidth, sHeight
            -offset.left, -offset.top, img_size.width, img_size.height,
            // dx, dy, dWidth, dHeight
            0, 0, img_size.width, img_size.height
        );

        this.props.poseImage({
            top: offset.top,
            left: offset.left,
        });
    }

    crop(moveEvent) {
        if (!this.state.cropping) return;
        if (this.props.width > this.state.img_size.width) return;
        if (this.props.height > this.state.img_size.height) return;

        const { img_size, delta, offset, canvas } = { ...this.state };
        const width = this.props.width;
        const height = this.props.height;

        const top = (
            moveEvent.pageY - window.scrollY
            - delta.top
            - canvas.top
        );
        const left = (
            moveEvent.pageX - window.scrollX
            - delta.left
            - canvas.left
        );

        function getTop() {
            const too_height = (
                canvas.top + top + img_size.height < canvas.top + height
            );
            const too_low = top > 0;

            if (too_height) {
                return height - img_size.height;
            } else if (too_low) {
                return 0;
            } else {
                return top;
            }
        }

        function getLeft() {
            const too_left = (
                canvas.left + left + img_size.width < canvas.left + width
            );
            const too_right = left > 0;

            if (too_left) {
                return width - img_size.width;
            } else if (too_right) {
                return 0;
            } else {
                return left;
            }
        }

        offset.top = getTop();
        offset.left = getLeft();

        this.setState({ offset });
        this.draw();
    };

    startCropping(clickEvent) {
        clickEvent.preventDefault();
        const canvas = this.canvas.getBoundingClientRect();
        const offset = { ...this.state.offset };

        // Calculate pixels to add to cursor coordinates
        let top = (
            // click position Y
            clickEvent.pageY - window.scrollY
            // image offset from canvas top
            - canvas.top
            - offset.top
        );
        let left = (
            // click position X
            clickEvent.pageX - window.scrollX
            // image offset from canvas Left
            - canvas.left
            - offset.left
        );

        this.setState({
            cropping: true,
            delta: {
                top, left
            },
            canvas: {
                top: canvas.top,
                left: canvas.left
            }
        });

        document.onmousemove = event => this.crop(event);
        document.onmouseup = () => this.stopCropping();
    };

    stopCropping() {
        this.setState({ cropping: false });
        this.props.setImage(this.canvas.toDataURL());
        document.onmousemove = null;
        document.onmouseup = null;
    };

    render() {
        return (
                <canvas
                    className="roppe-cropper-canvas"
                    width={ this.props.width }
                    height={ this.props.height }
                    onMouseDown={ event => this.startCropping(event) }
                    onMouseMove={ event => this.crop(event) }
                    onMouseUp={ () => this.stopCropping() }
                    ref={ canvas => this.canvas = canvas } />
        );
    }
}

Cropper.defaultProps = {
    width: 800,
    height: 600
};

Cropper.propTypes = {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    poseImage: React.PropTypes.func,
    setImage: React.PropTypes.func,
    img_element: React.PropTypes.object
};

export default Cropper;
