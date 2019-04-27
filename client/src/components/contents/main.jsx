import React, { Component } from 'react';
import Card from "./card"

class Main extends Component {
    state = {}
    render() {
        return (
            <div className="main-content">
                <div className="info-box">
                    <div className="info-result">Showing 6 Books under Bangla > Novel Humayun > Ahmed</div>
                </div>
                <div className="cards-wrapper">
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                </div>
            </div>
        );
    }
}

export default Main;