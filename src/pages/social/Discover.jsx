import React, { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { showToast } from '../../components/Schema';
import { useDispatch, useSelector } from 'react-redux';
import { getPeople, likeUser } from '../../slices/socialSlice';

import HeightIcon from '@mui/icons-material/Height';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import CakeIcon from '@mui/icons-material/Cake';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';


const Discover = () => {

  const dispatch = useDispatch();
  const { people, pepLoading, pepError, likLoading } = useSelector((state) => state.social);
  const { user } = useSelector((state) => state.auth);
  const [liked, setLiked] = useState({});

  useEffect(() => {
    if (people && user) {
      const initialLikedState = {};
      people.forEach((person) => {
        initialLikedState[person._id] = person.likes.includes(user._id);
      });
      setLiked(initialLikedState);
    }
  }, [people, user]);

  useEffect(() => {
    dispatch(getPeople({ page: 1, size: 20 }));
  }, [dispatch]);

  const handleLikeClick = async (personId) => {
    if (!liked[personId]) {
      try {
        const response = await dispatch(likeUser({ likedUserId: personId })).unwrap();
        if (response.status === "success") {
          setLiked((prev) => ({ ...prev, [personId]: true }));
          showToast('success', `${response.message}`);
        } else {
          showToast('error', `${response.message}`);
        }
      } catch (error) {
        showToast('error', 'Something went wrong!');
      }
    }
  };



  return (
    <Fragment>
      <Helmet>
        <title>Discover | JustDate - Find Genuine Connections Today</title>
        <meta name="description" content="JustDate is a modern dating platform designed to help you meet real people seeking meaningful relationships. Join today and start connecting with like-minded individuals for friendship, romance, or commitment." />
        <link rel="canonical" href="https://justdate.netlify.app/discover" />
      </Helmet>
      <div className='page flexcol wh'>
        <h1 className="heading">Discover people</h1>

        {pepLoading && <p>Loading...</p>}
        {pepError && <p>{pepError}</p>}

        <div className="discoverGrid">

          {!pepLoading && !pepError && people?.length > 0 ? people.map((person) => (
            <div className="disGridItem" key={person._id}>
              <p className='textBig'>{person.firstName} {person.lastName}</p>
              <div className="interestsTwo">
                {person.interests?.split(',').map((interest, index) => (
                  <p key={index} className="text">{interest.trim() || '...'}</p>
                ))}
              </div>
              <div className="details">
                <div className='subdetail'><CakeIcon /><p className='textBig'>{person.details?.age}</p></div>
                <div className='subdetail'><HeightIcon /><p className='textBig'>{person.details?.height}</p></div>
                <div className='subdetail'><EmojiPeopleIcon /> <p className='textBig'>{person.details?.bodyType}</p></div>
              </div>
              <div className="linksTwo">

                <div className={`likeButton ${likLoading ? 'disabled' : ''}`} onClick={() => handleLikeClick(person._id)}>
                  {liked[person._id] ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
                </div>

                <div className="flex g5">
                  {person.links?.imdb?.url && (
                    <a href={`https://${person.links.imdb.url}`} target="_blank" rel="noopener noreferrer">
                      <img src="https://res.cloudinary.com/dfsohhjfo/image/upload/v1729070090/JustDate/Assets/icons8-imdb-an-online-database-of-information-related-to-films_-and-television-programs-100_sbkn70.png" alt="imdb" />
                    </a>
                  )}
                  {person.links?.insta?.url && (
                    <a href={`https://${person.links.insta.url}`} target="_blank" rel="noopener noreferrer">
                      <img src="https://res.cloudinary.com/dfsohhjfo/image/upload/v1729070090/JustDate/Assets/icons8-instagram-100_tgb1t2.png" alt="instagram" />
                    </a>
                  )}
                  {person.links?.twitter?.url && (
                    <a href={`https://${person.links.twitter.url}`} target="_blank" rel="noopener noreferrer">
                      <img src="https://res.cloudinary.com/dfsohhjfo/image/upload/v1729070081/JustDate/Assets/icons8-twitter-100_pukkbt.png" alt="twitter" />
                    </a>
                  )}
                  {person.links?.spotify?.url && (
                    <a href={`https://${person.links.spotify.url}`} target="_blank" rel="noopener noreferrer">
                      <img src="https://res.cloudinary.com/dfsohhjfo/image/upload/v1729070081/JustDate/Assets/icons8-spotify-100_wivbcr.png" alt="spotify" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )) : (<p className='text'>There are no users yet!</p>)}
        </div>
      </div>
    </Fragment>
  );
};

export default Discover;