import React, { Component } from 'react';

class Card extends Component {
    state = {}
    render() {
        return (
            <div className="card-box">
                <div className="card-content">
                    <div className="card-image-box">
                        <img className="card-image" src="/demo-3.jpg" alt="" />
                    </div>
                    <div className="card-details">
                        <div className="card-title">
                            Harry Potter and the cursed child
                        </div>
                        <div className="card-subtitle">
                            by J K Rowling
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Card;