import React, { Fragment, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { updateProfile, updateShows, getShows, clearErrors } from '../../slices/authSlice';
import DOMPurify from 'dompurify';
import VerifiedIcon from '@mui/icons-material/Verified';
import NewReleasesIcon from '@mui/icons-material/NewReleases';


const Profile = () => {

    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const { upError, upGenErrors, shows, currentPage, total_pages, total_results, upshowErrors } = useSelector((state) => state.auth);
    const pageSize = 20;

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
                interests: user.interests || '',
                links: {
                    imdb: { url: user.links?.imdb?.url || '', isPublic: user.links?.imdb?.isPublic || false },
                    insta: { url: user.links?.insta?.url || '', isPublic: user.links?.insta?.isPublic || false },
                    twitter: { url: user.links?.twitter?.url || '', isPublic: user.links?.twitter?.isPublic || false },
                    spotify: { url: user.links?.spotify?.url || '', isPublic: user.links?.spotify?.isPublic || false }
                }
            }));
        }
    }, [user]);

    useEffect(() => {
        dispatch(getShows(currentPage));
        console.log(shows);
    }, [dispatch, currentPage]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= total_pages) {
            dispatch(getShows(newPage));
        }
    };

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
        dispatch(clearErrors());
    };

    const getFieldError = (field) => Array.isArray(upError) ? upError.find(error => error.path === field) : null;
    const interestsError = getFieldError('interests');
    const imdbError = getFieldError('links.imdb.url');
    const instaError = getFieldError('links.insta.url');
    const twitterError = getFieldError('links.twitter.url');
    const spotifyError = getFieldError('links.spotify.url');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isSubmitted) return;
        if (interestsError || imdbError || instaError || twitterError || spotifyError || upGenErrors) {
            toast(<div className='flex center g5'> < NewReleasesIcon /> Please fix the errors in the form.</div>, { duration: 3000, position: 'top-center', style: { color: 'red' }, className: 'failed', ariaProps: { role: 'status', 'aria-live': 'polite' } });
            return;
        }
        setIsSubmitted(true);
        try {
            const userData = {
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
            const response = await dispatch(updateProfile(userData)).unwrap();
            if (response.status === "success") {
                toast(<div className='flex center g5'> < VerifiedIcon /> {response.message}</div>, { duration: 3000, position: 'top-center', style: { color: 'rgb(0, 189, 0)' }, className: 'success', ariaProps: { role: 'status', 'aria-live': 'polite' } });
                setIsClickedFooter(false);
            } else {
                toast(<div className='flex center g5'> < NewReleasesIcon /> {response.message}</div>, { duration: 3000, position: 'top-center', style: { color: 'red' }, className: 'failed', ariaProps: { role: 'status', 'aria-live': 'polite' } });
            }
        } catch (error) {
            toast(<div className='flex center g5'> < NewReleasesIcon /> Error updating profile!</div>, { duration: 3000, position: 'top-center', style: { color: 'red' }, className: 'failed', ariaProps: { role: 'status', 'aria-live': 'polite' } });
        } finally {
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

            <div className="page flex wh">
                <div className="profile">
                    <div className="subProfile">
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
                                        <a href={`https://${user.links.imdb?.url || "#"}`} target="_blank" rel="noopener noreferrer">
                                            <img src="https://res.cloudinary.com/dfsohhjfo/image/upload/v1729070090/JustDate/Assets/icons8-imdb-an-online-database-of-information-related-to-films_-and-television-programs-100_sbkn70.png" className={user.links.imdb?.url ? 'filter' : ''} alt="imdb" />
                                        </a>
                                        <a href={`https://${user.links.insta?.url || "#"}`} target="_blank" rel="noopener noreferrer">
                                            <img src="https://res.cloudinary.com/dfsohhjfo/image/upload/v1729070090/JustDate/Assets/icons8-instagram-100_tgb1t2.png" className={user.links.insta?.url ? 'filter' : ''} alt="instagram" />
                                        </a>
                                        <a href={`https://${user.links.twitter?.url || "#"}`} target="_blank" rel="noopener noreferrer">
                                            <img src="https://res.cloudinary.com/dfsohhjfo/image/upload/v1729070081/JustDate/Assets/icons8-twitter-100_pukkbt.png" className={user.links.twitter?.url ? 'filter' : ''} alt="twitter" />
                                        </a>
                                        <a href={`https://${user.links.spotify?.url || "#"}`} target="_blank" rel="noopener noreferrer">
                                            <img src="https://res.cloudinary.com/dfsohhjfo/image/upload/v1729070081/JustDate/Assets/icons8-spotify-100_wivbcr.png" className={user.links.spotify?.url ? 'filter' : ''} alt="spotify" />
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
                                                <input type="text" name='interests' autoComplete='off' placeholder='Enter your interests(seprated by comma)' value={formValues.interests} onChange={handleInputChange} />
                                                {interestsError && <p className="error">{interestsError.msg}</p>}

                                                <input type="text" name='imdb.url' autoComplete='off' placeholder='Enter your imdb list...' value={formValues.links?.imdb?.url} onChange={handleInputChange} />
                                                {imdbError && <p className="error">{imdbError.msg}</p>}
                                                <input type="text" name='insta.url' autoComplete='username' placeholder='Share your instagram handle...' value={formValues.links?.insta?.url} onChange={handleInputChange} />
                                                {instaError && <p className="error">{instaError.msg}</p>}
                                                <input type="text" name='twitter.url' autoComplete='username' placeholder='Share your twitter handle...' value={formValues.links?.twitter?.url} onChange={handleInputChange} />
                                                {twitterError && <p className="error">{twitterError.msg}</p>}
                                                <input type="text" name='spotify.url' autoComplete='off' placeholder='Share your fav playlist...' value={formValues.links?.spotify?.url} onChange={handleInputChange} />
                                                {spotifyError && <p className="error">{spotifyError.msg}</p>}


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
                                            {upError?.length > 0 && <p className="error flex center">Please correct the above errors.</p>}
                                            {upGenErrors && <p className="error flex center">{upGenErrors}</p>}
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="subProfileTwo">
                        <h1 className="heading">Shows</h1>
                        <div className="showGrid">
                            {shows && shows.map((show, index) => (
                                <div className="showItem" key={index}>
                                    <img
                                        src={show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : 'https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko='}
                                        alt={show.name}
                                    />
                                    <p className='textSmol'>{show.name}</p>
                                </div>
                            ))}
                        </div>
                        {total_results > pageSize && (
                            <div className="pagination">
                                <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
                                    Previous
                                </button>
                                <span>{`Page ${currentPage} of ${total_pages}`}</span>
                                <button disabled={currentPage === total_pages} onClick={() => handlePageChange(currentPage + 1)}>
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Profile