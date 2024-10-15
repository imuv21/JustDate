import React, { Fragment } from 'react';
import './Loader.scss';

const Loader = () => {

    return (
        <Fragment>
            <div className="loader">
                <div className="LoaderBalls">
                    <div className="LoaderBalls__item"></div>
                    <div className="LoaderBalls__item"></div>
                    <div className="LoaderBalls__item"></div>
                </div>
            </div>
        </Fragment>
    );
};

export default Loader;

