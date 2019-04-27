import React, { Component } from 'react';
import LeftSide from "./contents/leftSide";
import Main from "./contents/main";

class Contents extends Component {
    state = {}
    render() {
        return (
            <div className="contents">
                <div className="content-box">
                    <div className="left-side-nav">
                        <LeftSide />
                    </div>
                    <div className="main-content">
                        <Main />
                    </div>
                    <div className="right-side-nav">
                        side Nav Right
                    </div>
                </div>
            </div>
        );
    }
}

export default Contents;