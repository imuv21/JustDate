import { Fragment, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMatchUser, unmatch } from '../../slices/socialSlice';
import { showToast } from '../../components/Schema';

import Loader from '../../components/Loader/Loader';
import HeightIcon from '@mui/icons-material/Height';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import CakeIcon from '@mui/icons-material/Cake';


const Chats = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { matchusers, matchLoading, matchError, unmatchLoading } = useSelector((state) => state.social);

  const chatHandler = (receiverId) => {
    navigate(`/chat/${receiverId}`);
  }

  const unmatchHandler = async (unmatchedUserId) => {
    try {
      const response = await dispatch(unmatch({ unmatchedUserId })).unwrap();
      if (response.status) {
        showToast('success', `${response.message}`);
      } else {
        showToast('error', `${response.message}`);
      }
    } catch (error) {
      showToast('error', 'Something went wrong!');
    }
  }

  useEffect(() => {
    dispatch(getMatchUser());
  }, [dispatch]);

  if (matchLoading) {
    return <Loader />;
  }

  return (
    <Fragment>
      <Helmet>
        <title>Chats | JustDate - Find Genuine Connections Today</title>
        <meta name="description" content="JustDate is a modern dating platform designed to help you meet real people seeking meaningful relationships. Join today and start connecting with like-minded individuals for friendship, romance, or commitment." />
        <link rel="canonical" href="https://justdate.netlify.app/chats" />
      </Helmet>
      <div className='page flexcol wh'>
        <h1 className="heading">Chats</h1>

        <div className="discoverGrid">
          {matchError ? (<p className='text'>Error loading users!</p>) : !matchLoading && !matchError && matchusers && matchusers.length > 0 ? matchusers.map((person) => (
            <div className="disGridItem" key={person._id}>
              <p className='textBig'>{person.firstName} {person.lastName}</p>
              <div className="interestsTwo">
                {person.interests?.map((interest, index) => (
                  <p key={index} className="text">{interest.trim() || '...'}</p>
                ))}
              </div>
              <div className="details">
                <div className='subdetail'><CakeIcon /><p className='textBig'>{person?.details?.age}</p></div>
                <div className='subdetail'><HeightIcon /><p className='textBig'>{person?.details?.height}</p></div>
                <div className='subdetail'><EmojiPeopleIcon /> <p className='textBig'>{person?.details?.bodyType}</p></div>
              </div>
              <div className="linksTwo">
                <button onClick={() => chatHandler(person._id)}>Chat</button>
                <button onClick={() => unmatchHandler(person._id)}>{unmatchLoading ? 'Removing...' : 'Unmatch'}</button>
              </div>
            </div>
          )) : (<p className='text'>You have no matches yet!</p>)}
        </div>
      </div>
    </Fragment>
  );
};

export default Chats;