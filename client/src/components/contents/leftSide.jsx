import React, { Component } from 'react';

class LeftSide extends Component {
    state = {}
    render() {
        return (
            <div className="ls-box">
                <div className="user-box">
                    <div className="user">
                        <div className="user-wrapper">
                            <img className="user-image" src="/avatar.svg" alt="none" />
                            <div className="user-details">
                                <div className="user-title">Mawlana</div>
                                <div className="user-sub">Since 1951</div>
                            </div>
                        </div>
                        <img className="user-notification" src="/notification.svg" alt="" />
                    </div>
                    <div className="user-credentials">
                        <div className="user-like">
                            <img className="user-like-icon" src="/like.svg" alt="like" />
                            <div className="user-like-count">283</div>
                        </div>
                        <div className="user-edit">
                            <img className="user-edit-icon" src="/edit.svg" alt="" />
                        </div>
                        <div className="user-tr">
                            <img className="user-tr-icon" src="/repeat.svg" alt="transactions" />
                            <div className="user-tr-count">1134</div>
                        </div>
                    </div>
                </div>
                <div className="filter">
                    <div className="filter-title">
                        Filters
                        </div>
                    <div className="filter-box">
                        <div className="box-wrapper">
                            <img className="down-icon" src="/down.svg" alt="" />
                            <div className="box">
                                <select className="select" name="" id="">
                                    <option value="">Language</option>
                                    <option value="">Bangla</option>
                                    <option value="">English</option>
                                </select>
                            </div>
                        </div>
                        <div className="box-wrapper">
                            <img className="down-icon" src="/down.svg" alt="" />
                            <div className="box">
                                <select className="select" name="" id="">
                                    <option value="">Category</option>
                                    <option value="">Novel</option>
                                    <option value="">Story</option>
                                    <option value="">Text Book</option>
                                    <option value="">Thriller</option>
                                    <option value="">Knowledge</option>
                                </select>
                            </div>
                        </div>
                        <div className="box-wrapper">
                            <img className="down-icon" src="/down.svg" alt="" />
                            <div className="box">
                                <select className="select" name="" id="">
                                    <option value="">Author</option>
                                    <option value="">Humayun Ahmed</option>
                                    <option value="">Modhusudon Datta</option>
                                    <option value="">Kamrujjaman Singh</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default LeftSide;