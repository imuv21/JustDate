import React, { Fragment, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { updateProfile, updateDetails, clearErrors } from '../../slices/authSlice';
import { seriesSchema, locationSchema } from '../../components/Schema';
import DOMPurify from 'dompurify';
import VerifiedIcon from '@mui/icons-material/Verified';
import NewReleasesIcon from '@mui/icons-material/NewReleases';


const Profile = () => {

    const dispatch = useDispatch();
    const { user, upError, upGenErrors, details, detError, detGenErrors, } = useSelector((state) => state.auth);
    const pageSize = 20;
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [editMode, setEditMode] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [isLocationSelected, setIsLocationSelected] = useState(false);
    const filteredLocations = locationSchema.filter((location) =>
        location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // edit profile
    const [isClickedFooter, setIsClickedFooter] = useState(false);
    const [isClickedFooterTwo, setIsClickedFooterTwo] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmittedTwo, setIsSubmittedTwo] = useState(false);

    const handleClickFooter = (event) => {
        event.preventDefault();
        setIsClickedFooter(true);
    };
    const handleClickFooterTwo = (event) => {
        event.preventDefault();
        setIsClickedFooterTwo(true);
    };
    const closepopup = (event) => {
        event.preventDefault();
        setIsClickedFooter(false);
        setIsClickedFooterTwo(false);
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
    const [detailValues, setDetailValues] = useState({
        age: null,
        gender: '',
        height: null,
        location: '',
        bodyType: '',
        drinking: '',
        smoking: '',
        relationshipStatus: '',
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
        if (details) {
            setDetailValues(prevValues => ({
                ...prevValues,
                age: details.age,
                gender: details.gender,
                height: details.height || null,
                location: details.location,
                bodyType: details.bodyType,
                drinking: details.drinking,
                smoking: details.smoking,
                relationshipStatus: details.relationshipStatus,
            }));
            setSearchTerm(details.location || '');
            setIsLocationSelected(!!details.location);
        }
    }, [details]);

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
    const handleSearchChange = (e) => {
        const { value } = e.target;
        setSearchTerm(value);
        setShowDropdown(true);
        setIsLocationSelected(false);
        handleDetailChange(e);
    };
    const handleDetailChange = (e) => {
        const { name, value } = e.target;
        setDetailValues({ ...detailValues, [name]: value });
        dispatch(clearErrors());
    };
    const handleSelectLocation = (location) => {
        setSearchTerm(location);
        handleDetailChange({ target: { name: 'location', value: location } });
        setShowDropdown(false);
        setIsLocationSelected(true);
    };

    const getFieldError = (field) => Array.isArray(upError) ? upError.find(error => error.path === field) : null;
    const interestsError = getFieldError('interests');
    const imdbError = getFieldError('links.imdb.url');
    const instaError = getFieldError('links.insta.url');
    const twitterError = getFieldError('links.twitter.url');
    const spotifyError = getFieldError('links.spotify.url');
    const getDetailError = (field) => Array.isArray(detError) ? detError.find(error => error.path === field) : null;
    const ageError = getDetailError('age');
    const genderError = getDetailError('gender');
    const heightError = getDetailError('height');
    const locationError = getDetailError('location');
    const bodyTypeError = getDetailError('bodyType');
    const drinkingError = getDetailError('drinking');
    const smokingError = getDetailError('smoking');
    const relationshipStatusError = getDetailError('relationshipStatus');

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
    const handleDetailSubmit = async (event) => {
        event.preventDefault();
        if (isSubmittedTwo) return;
        if (!isLocationSelected) {
            toast(<div className='flex center g5'> <NewReleasesIcon /> Please select a location from the dropdown.</div>, { duration: 3000, position: 'top-center', style: { color: 'red' }, className: 'failed', ariaProps: { role: 'status', 'aria-live': 'polite' } });
            return;
        }
        if (ageError || genderError || heightError || locationError || bodyTypeError || drinkingError || smokingError || relationshipStatusError || detGenErrors) {
            toast(<div className='flex center g5'> < NewReleasesIcon /> Please fix the errors in the form.</div>, { duration: 3000, position: 'top-center', style: { color: 'red' }, className: 'failed', ariaProps: { role: 'status', 'aria-live': 'polite' } });
            return;
        }
        setIsSubmittedTwo(true);
        try {
            const detailData = {
                age: DOMPurify.sanitize(detailValues.age),
                gender: DOMPurify.sanitize(detailValues.gender),
                height: DOMPurify.sanitize(detailValues.height),
                location: DOMPurify.sanitize(detailValues.location),
                bodyType: DOMPurify.sanitize(detailValues.bodyType),
                drinking: DOMPurify.sanitize(detailValues.drinking),
                smoking: DOMPurify.sanitize(detailValues.smoking),
                relationshipStatus: DOMPurify.sanitize(detailValues.relationshipStatus),
            };
            const response = await dispatch(updateDetails(detailData)).unwrap();
            if (response.status === "success") {
                toast(<div className='flex center g5'> < VerifiedIcon /> {response.message}</div>, { duration: 3000, position: 'top-center', style: { color: 'rgb(0, 189, 0)' }, className: 'success', ariaProps: { role: 'status', 'aria-live': 'polite' } });
                setIsClickedFooterTwo(false);
            } else {
                toast(<div className='flex center g5'> < NewReleasesIcon /> {response.message}</div>, { duration: 3000, position: 'top-center', style: { color: 'red' }, className: 'failed', ariaProps: { role: 'status', 'aria-live': 'polite' } });
            }
        } catch (error) {
            toast(<div className='flex center g5'> < NewReleasesIcon /> Error updating details!</div>, { duration: 3000, position: 'top-center', style: { color: 'red' }, className: 'failed', ariaProps: { role: 'status', 'aria-live': 'polite' } });
        } finally {
            setIsSubmittedTwo(false);
            setIsLocationSelected(false);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (isClickedFooter || isClickedFooterTwo) {
                setIsClickedFooter(false);
                setIsClickedFooterTwo(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isClickedFooter, isClickedFooterTwo]);

    //password protect
    const [showPassword, setShowPassword] = useState(false);
    const seePassword = () => {
        setShowPassword(prev => !prev);
    }

    const filteredItems = seriesSchema.filter((show) =>
        show.original_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const total_results = filteredItems.length;
    const total_pages = Math.ceil(total_results / pageSize);

    //pagination
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= total_pages) {
            setCurrentPage(newPage);
        }
    };
    const paginatedItems = filteredItems.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );


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
                            {user.interests ?
                                (<div className="interestsCont">
                                    <h1 className="headingSmol">Interests</h1>
                                    <div className="interests">
                                        {user.interests.split(',').map((interest, index) => (
                                            <p key={index} className="textBig">{interest.trim() || '...'}</p>
                                        ))}
                                    </div>
                                </div>) : (
                                    <p className='error'>Must update your profile and details only then people can see you!</p>
                                )
                            }
                            <div className="links">
                                {user.links && (
                                    <>
                                        <a href={`https://${user.links.imdb?.url || "www.imdb.com"}`} target="_blank" rel="noopener noreferrer">
                                            <img src="https://res.cloudinary.com/dfsohhjfo/image/upload/v1729070090/JustDate/Assets/icons8-imdb-an-online-database-of-information-related-to-films_-and-television-programs-100_sbkn70.png" className={user.links.imdb?.url ? 'filter' : ''} alt="imdb" />
                                        </a>
                                        <a href={`https://${user.links.insta?.url || "www.instagram.com"}`} target="_blank" rel="noopener noreferrer">
                                            <img src="https://res.cloudinary.com/dfsohhjfo/image/upload/v1729070090/JustDate/Assets/icons8-instagram-100_tgb1t2.png" className={user.links.insta?.url ? 'filter' : ''} alt="instagram" />
                                        </a>
                                        <a href={`https://${user.links.twitter?.url || "www.x.com"}`} target="_blank" rel="noopener noreferrer">
                                            <img src="https://res.cloudinary.com/dfsohhjfo/image/upload/v1729070081/JustDate/Assets/icons8-twitter-100_pukkbt.png" className={user.links.twitter?.url ? 'filter' : ''} alt="twitter" />
                                        </a>
                                        <a href={`https://${user.links.spotify?.url || "open.spotify.com"}`} target="_blank" rel="noopener noreferrer">
                                            <img src="https://res.cloudinary.com/dfsohhjfo/image/upload/v1729070081/JustDate/Assets/icons8-spotify-100_wivbcr.png" className={user.links.spotify?.url ? 'filter' : ''} alt="spotify" />
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="pagebox20 flex center-start">
                            <div className={`popup-btn ${isClickedFooter ? 'clicked' : ''}`}>
                                <button onClick={handleClickFooter}>Edit Profile</button>
                                {isClickedFooter && (
                                    <div className="popup">
                                        <form className="popup-wrapper" onSubmit={handleSubmit}>
                                            <h2 className="heading" style={{ marginBottom: '15px' }}>Update Profile</h2>

                                            <div className="pagebox5 flexcol center">
                                                <input type="text" name='firstName' autoComplete='name' placeholder='Enter your first name...' value={formValues.firstName} onChange={handleInputChange} required />
                                            </div>
                                            <div className="pagebox5 flexcol center">
                                                <input type="text" name='lastName' autoComplete='name' placeholder='Enter your last name...' value={formValues.lastName} onChange={handleInputChange} required />
                                            </div>
                                            <div className="pagebox5 flexcol center">
                                                <input type="text" name='interests' autoComplete='off' placeholder='Enter your interests(seprated by comma)' value={formValues.interests} onChange={handleInputChange} />
                                                {interestsError && <p className="error">{interestsError.msg}</p>}
                                            </div>
                                            <div className="pagebox5 flexcol center">
                                                <input type="text" name='imdb.url' autoComplete='off' placeholder='Enter your imdb list...' value={formValues.links?.imdb?.url} onChange={handleInputChange} />
                                                {imdbError && <p className="error">{imdbError.msg}</p>}
                                            </div>
                                            <div className="pagebox5 flexcol center">
                                                <input type="text" name='insta.url' autoComplete='username' placeholder='Share your instagram handle...' value={formValues.links?.insta?.url} onChange={handleInputChange} />
                                                {instaError && <p className="error">{instaError.msg}</p>}
                                            </div>
                                            <div className="pagebox5 flexcol center">
                                                <input type="text" name='twitter.url' autoComplete='username' placeholder='Share your twitter handle...' value={formValues.links?.twitter?.url} onChange={handleInputChange} />
                                                {twitterError && <p className="error">{twitterError.msg}</p>}
                                            </div>
                                            <div className="pagebox5 flexcol center">
                                                <input type="text" name='spotify.url' autoComplete='off' placeholder='Share your fav playlist...' value={formValues.links?.spotify?.url} onChange={handleInputChange} />
                                                {spotifyError && <p className="error">{spotifyError.msg}</p>}
                                            </div>
                                            <div className="pagebox5 flex center-start">
                                                <input type="checkbox" name='imdb.isPublic' checked={formValues.links?.imdb?.isPublic} onChange={handleInputChange} /> <div className="text">Public(IMDb)</div>
                                                <input type="checkbox" name='insta.isPublic' checked={formValues.links?.insta?.isPublic} onChange={handleInputChange} /> <div className="text">Public(Insta)</div>
                                            </div>
                                            <div className="pagebox5 flex center-start">
                                                <input type="checkbox" name='twitter.isPublic' checked={formValues.links?.twitter?.isPublic} onChange={handleInputChange} /> <div className="text">Public(Twitter)</div>
                                                <input type="checkbox" name='spotify.isPublic' checked={formValues.links?.spotify?.isPublic} onChange={handleInputChange} /> <div className="text">Public(Spotify)</div>
                                            </div>

                                            <div className="flex center g20 wh" style={{ marginTop: '15px' }}>
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


                        <h1 className="heading">Details</h1>
                        <div className="pagebox10 flexcol start-center">
                            <div className="pagebox20 flex center-space">
                                <p className="textBig">Age :</p>
                                <p className="textBig">{details?.age ? `${details.age} Yrs` : '...'}</p>
                            </div>
                            <div className="pagebox20 flex center-space">
                                <p className="textBig">Gender :</p>
                                <p className="textBig">{details?.gender ? details.gender : '...'}</p>
                            </div>
                            <div className="pagebox20 flex center-space">
                                <p className="textBig">Height :</p>
                                <p className="textBig">{details?.height ? `${details.height} Inc` : '...'}</p>
                            </div>
                            <div className="pagebox20 flex center-space">
                                <p className="textBig">Location :</p>
                                <p className="textBig">{details?.location ? details.location : '...'}</p>
                            </div>
                            <div className="pagebox20 flex center-space">
                                <p className="textBig">Body Type :</p>
                                <p className="textBig">{details?.bodyType ? details.bodyType : '...'}</p>
                            </div>
                            <div className="pagebox20 flex center-space">
                                <p className="textBig">Drinking :</p>
                                <p className="textBig">{details?.drinking ? details.drinking : '...'}</p>
                            </div>
                            <div className="pagebox20 flex center-space">
                                <p className="textBig">Smoking :</p>
                                <p className="textBig">{details?.smoking ? details.smoking : '...'}</p>
                            </div>
                            <div className="pagebox20 flex center-space">
                                <p className="textBig">Relationship Status :</p>
                                <p className="textBig">{details?.relationshipStatus ? details.relationshipStatus : '...'}</p>
                            </div>
                        </div>
                        <div className="pagebox20 flex center-start">
                            <div className={`popup-btn ${isClickedFooterTwo ? 'clicked' : ''}`}>
                                <button onClick={handleClickFooterTwo}>Edit Details</button>
                                {isClickedFooterTwo && (
                                    <div className="popup">
                                        <form className="popup-wrapper" onSubmit={handleDetailSubmit}>
                                            <h2 className="heading" style={{ marginBottom: '15px' }}>Update Details</h2>

                                            <div className="pagebox5 flexcol center">
                                                <input type="number" name='age' autoComplete='off' placeholder='Enter your age' value={detailValues.age} onChange={handleDetailChange} />
                                                {ageError && <p className="error">{ageError.msg}</p>}
                                            </div>
                                            <div className="pagebox5 flexcol center">
                                                <select name="gender" value={detailValues.gender} onChange={handleDetailChange}>
                                                    <option value="">Select your gender</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                </select>
                                                {genderError && <p className="error">{genderError.msg}</p>}
                                            </div>
                                            <div className="pagebox5 flexcol center">
                                                <input type="number" name="height" autoComplete="off" placeholder="Enter your height (in inches)" value={detailValues.height} onChange={handleDetailChange} />
                                                {heightError && <p className="error">{heightError.msg}</p>}
                                            </div>
                                            <div className="pagebox5 flexcol center">
                                                <div style={{ position: 'relative' }} className='wh'>
                                                    <input type="text" name="location" placeholder="Enter your location" value={searchTerm}
                                                        onChange={handleSearchChange} autoComplete="off"
                                                    />

                                                    {showDropdown && filteredLocations.length > 0 && (
                                                        <ul className='locationDropdown'>
                                                            {filteredLocations.map((location, index) => (
                                                                <li key={index} onClick={() => handleSelectLocation(location)} style={{ padding: '8px', cursor: 'pointer' }}
                                                                >
                                                                    {location}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                                {locationError && <p className="error">{locationError.msg}</p>}
                                            </div>
                                            <div className="pagebox5 flexcol center">
                                                <select name="bodyType" value={detailValues.bodyType} onChange={handleDetailChange}>
                                                    <option value="">Select your body type</option>
                                                    <option value="Skinny">Skinny</option>
                                                    <option value="Average">Average</option>
                                                    <option value="Curvy">Curvy</option>
                                                    <option value="Healthy">Healthy</option>
                                                </select>
                                                {bodyTypeError && <p className="error">{bodyTypeError.msg}</p>}
                                            </div>
                                            <div className="pagebox5 flexcol center">
                                                <select name="drinking" value={detailValues.drinking} onChange={handleDetailChange}>
                                                    <option value="">Select drinking status</option>
                                                    <option value="Yes">Yes</option>
                                                    <option value="No">No</option>
                                                </select>
                                                {drinkingError && <p className="error">{drinkingError.msg}</p>}
                                            </div>
                                            <div className="pagebox5 flexcol center">
                                                <select name="smoking" value={detailValues.smoking} onChange={handleDetailChange}>
                                                    <option value="">Select smoking status</option>
                                                    <option value="Yes">Yes</option>
                                                    <option value="No">No</option>
                                                </select>
                                                {smokingError && <p className="error">{smokingError.msg}</p>}
                                            </div>
                                            <div className="pagebox5 flexcol center">
                                                <select name="relationshipStatus" value={detailValues.relationshipStatus} onChange={handleDetailChange}>
                                                    <option value="">Select your relationship status</option>
                                                    <option value="Single">Single</option>
                                                    <option value="Separated">Separated</option>
                                                    <option value="Widowed">Widowed</option>
                                                </select>
                                                {relationshipStatusError && <p className="error">{relationshipStatusError.msg}</p>}
                                            </div>

                                            <div className="flex center g20 wh" style={{ marginTop: '15px' }}>
                                                <button type='submit' disabled={isSubmittedTwo}>{isSubmittedTwo ? 'Updating...' : 'Update'}</button>
                                                <button type="button" onClick={closepopup} className="btn">Cancel</button>
                                            </div>
                                            {detError?.length > 0 && <p className="error flex center">Please correct the above errors.</p>}
                                            {detGenErrors && <p className="error flex center">{detGenErrors}</p>}
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* {editMode ? (
                        <div className="subProfileTwo">
                            <h1 className="heading">Shows</h1>
                            <div className="flex center-space wh">
                                <input type="text" className="searchInput" placeholder="Search shows..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }} />
                                <button onClick={() => setEditMode(false)}>Save</button>
                            </div>
                            <p className='textSmol'>Showing {paginatedItems.length} out of {seriesSchema.length} shows</p>

                            <div className="showGrid">
                                {paginatedItems && paginatedItems.map((show, index) => (
                                    <div className="showItem" key={index}>
                                        <img
                                            src={show.poster_url ? `${show.poster_url}` : 'https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko='}
                                            alt={show.original_name ? show.original_name : `poster-${index}`}
                                        />
                                        <p className='textSmol'>{show.original_name ? show.original_name : `Unknown`}</p>
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
                    ) : (
                        <div className="subProfileTwo">
                            <h1 className="heading">Your top 10</h1>
                            <div className="showGrid">
                                {paginatedItems && paginatedItems.map((show, index) => (
                                    <div className="showItem" key={index}>
                                        <img
                                            src={show.poster_url ? `${show.poster_url}` : 'https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko='}
                                            alt={show.original_name ? show.original_name : `poster-${index}`}
                                        />
                                        <p className='textSmol'>{show.original_name ? show.original_name : `Unknown`}</p>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => setEditMode(true)}>Edit</button>
                        </div>
                    )} */}
                </div>
            </div>
        </Fragment>
    )
}

export default Profile