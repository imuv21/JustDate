import React, { Fragment, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { updateProfile } from '../../slices/authSlice';
import DOMPurify from 'dompurify';

import VerifiedIcon from '@mui/icons-material/Verified';
import NewReleasesIcon from '@mui/icons-material/NewReleases';


const Profile = () => {

    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    // edit profile
    const [isClickedFooter, setIsClickedFooter] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const handleClickFooter = (event) => {
        event.preventDefault();
        setIsClickedFooter(true);
    };
    const closepopup = (event) => {
        event.preventDefault();
        setIsClickedFooter(false);
    }

    const [formValues, setFormValues] = useState({
        firstName: '',
        lastName: '',
        interests: '',
        links: {
            imdb: { url: '', isPublic: false },
            insta: { url: '', isPublic: false },
            twitter: { url: '', isPublic: false },
            spotify: { url: '', isPublic: false }
        }
    });

    useEffect(() => {
        if (user) {
            setFormValues(prevValues => ({
                ...prevValues, 
                firstName: user.firstName,
                lastName: user.lastName,
                interests: user.interests || ''
            }));
        }
    }, [user]);

    useEffect(() => {
        if (user && user.links) {
            setFormValues(prevValues => ({
                ...prevValues,
                links: {
                    imdb: { url: user.links[0].imdb?.url || '', isPublic: user.links[0].imdb?.isPublic || false },
                    insta: { url: user.links[0].insta?.url || '', isPublic: user.links[0].insta?.isPublic || false },
                    twitter: { url: user.links[0].twitter?.url || '', isPublic: user.links[0].twitter?.isPublic || false },
                    spotify: { url: user.links[0].spotify?.url || '', isPublic: user.links[0].spotify?.isPublic || false }
                }
            }));
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.includes('imdb') || name.includes('insta') || name.includes('twitter') || name.includes('spotify')) {
            const [platform, key] = name.split('.');
            setFormValues({
                ...formValues,
                links: {
                    ...formValues.links,
                    [platform]: {
                        ...formValues.links[platform],
                        [key]: type === 'checkbox' ? checked : value
                    }
                }
            });
        } else {
            setFormValues({ ...formValues, [name]: value });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isSubmitted) return;
        setIsSubmitted(true);
        try {
            const sanitizedFormValues = {
                firstName: DOMPurify.sanitize(formValues.firstName),
                lastName: DOMPurify.sanitize(formValues.lastName),
                interests: DOMPurify.sanitize(formValues.interests),
                links: {
                    imdb: { url: DOMPurify.sanitize(formValues.links.imdb.url), isPublic: formValues.links.imdb.isPublic },
                    insta: { url: DOMPurify.sanitize(formValues.links.insta.url), isPublic: formValues.links.insta.isPublic },
                    twitter: { url: DOMPurify.sanitize(formValues.links.twitter.url), isPublic: formValues.links.twitter.isPublic },
                    spotify: { url: DOMPurify.sanitize(formValues.links.spotify.url), isPublic: formValues.links.spotify.isPublic }
                }
            };
            const response = await dispatch(updateProfile(sanitizedFormValues)).unwrap();
            if (response.status === "success") {
                toast(<div className='flex center g5'> < VerifiedIcon /> {response.message}</div>, { duration: 3000, position: 'top-center', style: { color: 'rgb(0, 189, 0)' }, className: 'success', ariaProps: { role: 'status', 'aria-live': 'polite' } });
            } else {
                toast(<div className='flex center g5'> < NewReleasesIcon /> {response.message}</div>, { duration: 3000, position: 'top-center', style: { color: 'red' }, className: 'failed', ariaProps: { role: 'status', 'aria-live': 'polite' } });
            }
        } catch (error) {
            toast(<div className='flex center g5'> < NewReleasesIcon /> Error updating profile!</div>, { duration: 3000, position: 'top-center', style: { color: 'red' }, className: 'failed', ariaProps: { role: 'status', 'aria-live': 'polite' } });
        } finally {
            setIsClickedFooter(false);
            setIsSubmitted(false);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (isClickedFooter) {
                setIsClickedFooter(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isClickedFooter]);

    //password protect
    const [showPassword, setShowPassword] = useState(false);
    const seePassword = () => {
        setShowPassword(prev => !prev);
    }


    return (
        <Fragment>
            <Helmet>
                <title>Profile | JustDate - Find Genuine Connections Today</title>
                <meta name="description" content="JustDate is a modern dating platform designed to help you meet real people seeking meaningful relationships. Join today and start connecting with like-minded individuals for friendship, romance, or commitment." />
                <link rel="canonical" href="https://justdate.netlify.app/profile" />
            </Helmet>

            <div className="page flex center-start" style={{ height: '100vh' }}>
                <div className="profile">
                    <h1 className="heading">Profile</h1>

                    <div className="pagebox10 flexcol start-center">
                        <div className="pagebox20 flex center-space">
                            <p className="textBig">Name :</p>
                            <p className="textBig">{user.firstName} {user.lastName}</p>
                        </div>
                        <div className="pagebox20 flex center-space">
                            <p className="textBig">Email :</p>
                            <p className="textBig verify flex center-start g5">{user.email}
                                {user.isVerified === 1 ? <VerifiedIcon /> : <NewReleasesIcon style={{ color: 'orange' }} />}
                            </p>
                        </div>
                        <div className="pagebox20 flex center-space">
                            <p className="textBig">Password :</p>
                            <div className="textBig" style={{ cursor: 'pointer' }} onClick={seePassword}> {showPassword ? user.password : '***********'} </div>
                        </div>
                        {user.interests && <div className="pagebox20 flex center-space">
                            <p className="textBig">Interests :</p>
                            <p className="textBig">{user.interests}</p>
                        </div>}
                        <div className="links">
                            {user.links ? (
                                <>
                                    <a href={user.links[0].imdb?.url || "#"} target="_blank" rel="noopener noreferrer">
                                        <img src="https://res.cloudinary.com/dfsohhjfo/image/upload/v1729070090/JustDate/icons8-imdb-an-online-database-of-information-related-to-films_-and-television-programs-100_sbkn70.png" className={user.links[0].imdb?.url ? 'filter' : ''} alt="imdb" />
                                    </a>
                                    <a href={user.links[0].insta?.url || "#"} target="_blank" rel="noopener noreferrer">
                                        <img src="https://res.cloudinary.com/dfsohhjfo/image/upload/v1729070090/JustDate/icons8-instagram-100_tgb1t2.png" className={user.links[0].insta?.url ? 'filter' : ''} alt="instagram" />
                                    </a>
                                    <a href={user.links[0].twitter?.url || "#"} target="_blank" rel="noopener noreferrer">
                                        <img src="https://res.cloudinary.com/dfsohhjfo/image/upload/v1729070081/JustDate/icons8-twitter-100_pukkbt.png" className={user.links[0].twitter?.url ? 'filter' : ''} alt="twitter" />
                                    </a>
                                    <a href={user.links[0].spotify?.url || "#"} target="_blank" rel="noopener noreferrer">
                                        <img src="https://res.cloudinary.com/dfsohhjfo/image/upload/v1729070081/JustDate/icons8-spotify-100_wivbcr.png" className={user.links[0].spotify?.url ? 'filter' : ''} alt="spotify" />
                                    </a>
                                </>
                            ) : (
                                <p>No social links available</p>
                            )}
                        </div>
                    </div>

                    <div className="pagebox20 flex center-start">
                        <div className={`popup-btn ${isClickedFooter ? 'clicked' : ''}`}>
                            <button onClick={handleClickFooter}>Edit Profile</button>
                            {isClickedFooter && (
                                <div className="popup">
                                    <form className="popup-wrapper" onSubmit={handleSubmit}>
                                        <h2 className="heading">Update Profile</h2>

                                        <div className="pagebox10 flexcol center">
                                            <input type="text" name='firstName' autoComplete='name' placeholder='Enter your first name...' value={formValues.firstName} onChange={handleInputChange} required />
                                            <input type="text" name='lastName' autoComplete='name' placeholder='Enter your last name...' value={formValues.lastName} onChange={handleInputChange} required />
                                            <input type="text" name='interests' autoComplete='off' placeholder='Enter your interests...' value={formValues.interests} onChange={handleInputChange} />

                                            <input type="text" name='imdb.url' autoComplete='off' placeholder='Enter your imdb list...' value={formValues.links?.imdb?.url} onChange={handleInputChange} />
                                            <input type="text" name='insta.url' autoComplete='username' placeholder='Share your instagram handle...' value={formValues.links?.insta?.url} onChange={handleInputChange} />
                                            <input type="text" name='twitter.url' autoComplete='username' placeholder='Share your twitter handle...' value={formValues.links?.twitter?.url} onChange={handleInputChange} />
                                            <input type="text" name='spotify.url' autoComplete='off' placeholder='Share your fav playlist...' value={formValues.links?.spotify?.url} onChange={handleInputChange} />

                                            <div className="pagebox10 flex center-start">
                                                <input type="checkbox" name='imdb.isPublic' checked={formValues.links?.imdb?.isPublic} onChange={handleInputChange} /> <div className="text">Public(IMDb)</div>
                                                <input type="checkbox" name='insta.isPublic' checked={formValues.links?.insta?.isPublic} onChange={handleInputChange} /> <div className="text">Public(Insta)</div>
                                            </div>
                                            <div className="pagebox10 flex center-start">
                                                <input type="checkbox" name='twitter.isPublic' checked={formValues.links?.twitter?.isPublic} onChange={handleInputChange} /> <div className="text">Public(Twitter)</div>
                                                <input type="checkbox" name='spotify.isPublic' checked={formValues.links?.spotify?.isPublic} onChange={handleInputChange} /> <div className="text">Public(Spotify)</div>
                                            </div>
                                        </div>

                                        <div className="flex center g20 wh">
                                            <button type='submit' disabled={isSubmitted}>{isSubmitted ? 'Updating...' : 'Update'}</button>
                                            <button type="button" onClick={closepopup} className="btn">Cancel</button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Profile