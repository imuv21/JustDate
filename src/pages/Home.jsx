import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet-async';

const Home = () => {

  return (
    <Fragment>
      <Helmet>
        <title>Home Page | JustDate - Find Genuine Connections Today</title>
        <meta name="description" content="JustDate is a modern dating platform designed to help you meet real people seeking meaningful relationships. Join today and start connecting with like-minded individuals for friendship, romance, or commitment." />
        <link rel="canonical" href="https://justdate.netlify.app/" />
      </Helmet>
      <div className='page flexcol g5 center'>
        <h1 className="text">Home page</h1>
      </div>
    </Fragment>
  );
};

export default Home;