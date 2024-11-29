import React, { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { likeUser, getLikeUser } from '../../slices/socialSlice';

import HeightIcon from '@mui/icons-material/Height';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import CakeIcon from '@mui/icons-material/Cake';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import VerifiedIcon from '@mui/icons-material/Verified';
import NewReleasesIcon from '@mui/icons-material/NewReleases';



const Likes = () => {

    const dispatch = useDispatch();
    const { likLoading, likeusers, likeLoading, likeError } = useSelector((state) => state.social);
    const { user } = useSelector((state) => state.auth);
    const [liked, setLiked] = useState({});

    useEffect(() => {
        if (likeusers && user) {
            const initialLikedState = {};
            likeusers.forEach((person) => {
                initialLikedState[person._id] = person.likes.includes(user._id);
            });
            setLiked(initialLikedState);
        }
    }, [likeusers, user]);

    useEffect(() => {
        dispatch(getLikeUser());
    }, [dispatch]);

    const handleLikeClick = async (personId) => {
        if (!liked[personId]) {
            try {
                const response = await dispatch(likeUser({ likedUserId: personId })).unwrap();
                if (response.status === "success") {
                    dispatch(getLikeUser());
                    setLiked((prev) => ({ ...prev, [personId]: true }));
                    toast(<div className='flex center g5'> < VerifiedIcon /> {response.message}</div>, { duration: 6000, position: 'top-center', style: { color: 'rgb(0, 189, 0)' }, className: 'success', ariaProps: { role: 'status', 'aria-live': 'polite' } });
                } else {
                    toast(<div className='flex center g5'> < NewReleasesIcon /> {response.message}</div>, { duration: 3000, position: 'top-center', style: { color: 'red' }, className: 'failed', ariaProps: { role: 'status', 'aria-live': 'polite' } });
                }
            } catch (error) {
                toast(<div className='flex center g5'> < NewReleasesIcon /> Something went wrong!</div>, { duration: 3000, position: 'top-center', style: { color: 'red' }, className: 'failed', ariaProps: { role: 'status', 'aria-live': 'polite' } });
            }
        }
    };


    return (
        <Fragment>
            <Helmet>
                <title>Likes | JustDate - Find Genuine Connections Today</title>
                <meta name="description" content="JustDate is a modern dating platform designed to help you meet real people seeking meaningful relationships. Join today and start connecting with like-minded individuals for friendship, romance, or commitment." />
                <link rel="canonical" href="https://justdate.netlify.app/likes" />
            </Helmet>
            <div className='page flexcol wh'>
                <h1 className="heading">Likes</h1>

                {likeLoading && <p>Loading...</p>}
                {likeError && <p>{likeError}</p>}

                <div className="discoverGrid">

                    {!likeLoading && !likeError && likeusers?.length > 0 ? likeusers.map((person) => (
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
                            </div>
                        </div>
                    )) : (<p className='text'>You have no likes yet!</p>)}

                </div>
            </div>
        </Fragment>
    );
};

export default Likes;