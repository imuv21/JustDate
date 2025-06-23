import { Fragment, useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, updateDetails, clearErrors } from '../../slices/authSlice';
import { locationSchema, professionSchema, interestsSchema } from '../../components/Schema';
import { showToast } from '../../components/Schema';
import DOMPurify from 'dompurify';
import VerifiedIcon from '@mui/icons-material/Verified';
import NewReleasesIcon from '@mui/icons-material/NewReleases';


const Profile = () => {

    const dispatch = useDispatch();
    const { user, upError, upGenErrors, details, detError, detGenErrors, } = useSelector((state) => state.auth);

    // location
    const [searchLocation, setSearchLocation] = useState('');
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [isLocationSelected, setIsLocationSelected] = useState(false);
    const filteredLocations = useMemo(() =>
        locationSchema.filter(location =>
            location.toLowerCase().includes(searchLocation.toLowerCase())
        ), [searchLocation]
    );
    const handleLocationChange = (e) => {
        const { value } = e.target;
        setSearchLocation(value);
        setShowLocationDropdown(true);
        setIsLocationSelected(false);
        handleDetailChange(e);
    };
    const handleSelectLocation = (location) => {
        setSearchLocation(location);
        handleDetailChange({ target: { name: 'location', value: location } });
        setShowLocationDropdown(false);
        setIsLocationSelected(true);
    };

    // profession
    const [searchProfession, setSearchProfession] = useState('');
    const [showProfessionDropdown, setShowProfessionDropdown] = useState(false);
    const [isProfessionSelected, setIsProfessionSelected] = useState(false);
    const filteredProfessions = useMemo(() =>
        professionSchema.filter(profession =>
            profession.toLowerCase().includes(searchProfession.toLowerCase())
        ), [searchProfession]
    );
    const handleProfessionChange = (e) => {
        const { value } = e.target;
        setSearchProfession(value);
        setShowProfessionDropdown(true);
        setIsProfessionSelected(false);
        handleDetailChange(e);
    };
    const handleSelectProfession = (profession) => {
        setSearchProfession(profession);
        handleDetailChange({ target: { name: 'profession', value: profession } });
        setShowProfessionDropdown(false);
        setIsProfessionSelected(true);
    };

    // interests
    const [searchInterests, setSearchInterests] = useState('');
    const [showInterestsDropdown, setShowInterestsDropdown] = useState(false);
    const filteredInterests = useMemo(() =>
        interestsSchema.filter(interest =>
            interest.toLowerCase().includes(searchInterests.toLowerCase())
        ), [searchInterests]
    );
    const handleInterestChange = (e) => {
        const { value } = e.target;
        setSearchInterests(value);
        setShowInterestsDropdown(true);
        if (value.includes(',')) {
            const newInterests = value.split(',')
                .map(item => item.trim())
                .filter(item => item);
            setFormValues(prev => ({
                ...prev,
                interests: [...new Set([...prev.interests, ...newInterests])]
            }));
            setSearchInterests('');
        }
        dispatch(clearErrors());
    };
    const handleSelectInterest = (interest) => {
        setFormValues(prev => ({ ...prev, interests: [...new Set([...prev.interests, interest])] }));
        setSearchInterests('');
        setShowInterestsDropdown(false);
    };
    const removeInterest = (index) => {
        setFormValues(prev => ({ ...prev, interests: prev.interests.filter((_, i) => i !== index) }));
    };

    // forms
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
        interests: [],
        links: {
            imdb: '',
            insta: '',
            twitter: '',
            spotify: ''
        }
    });
    const [detailValues, setDetailValues] = useState({
        age: null,
        height: null,
        location: '',
        profession: '',
        gender: '',
        drinking: '',
        smoking: '',
        haveKids: '',
        lookingFor: '',
        datingType: '',
        relationshipStatus: '',
        eatingHabit: '',
        bodyType: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'interests') {
            const interestsArray = value.split(',').map(item => item.trim());
            setFormValues(prev => ({ ...prev, [name]: interestsArray }));
        } else if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormValues(prev => ({
                ...prev,
                links: { ...prev.links, [parent]: { ...prev.links[parent], [child]: value } }
            }));
        } else {
            setFormValues(prev => ({ ...prev, [name]: value }));
        }
        dispatch(clearErrors());
    };
    const handleDetailChange = (e) => {
        const { name, value } = e.target;
        setDetailValues({ ...detailValues, [name]: value });
        dispatch(clearErrors());
    };

    const getFieldError = (field) => Array.isArray(upError) ? upError.find(error => error.path === field) : null;
    const firstNameError = getFieldError('firstName');
    const lastNameError = getFieldError('lastName');
    const interestsError = getFieldError('interests');
    const imdbError = getFieldError('links.imdb');
    const instaError = getFieldError('links.insta');
    const twitterError = getFieldError('links.twitter');
    const spotifyError = getFieldError('links.spotify');
    const getDetailError = (field) => Array.isArray(detError) ? detError.find(error => error.path === field) : null;
    const ageError = getDetailError('age');
    const heightError = getDetailError('height');
    const locationError = getDetailError('location');
    const professionError = getDetailError('profession');
    const genderError = getDetailError('gender');
    const drinkingError = getDetailError('drinking');
    const smokingError = getDetailError('smoking');
    const haveKidsError = getDetailError('haveKids');
    const lookingForError = getDetailError('lookingFor');
    const datingTypeError = getDetailError('datingType');
    const relationshipStatusError = getDetailError('relationshipStatus');
    const eatingHabitError = getDetailError('eatingHabit');
    const bodyTypeError = getDetailError('bodyType');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isSubmitted) return;
        if (firstNameError || lastNameError || interestsError || imdbError || instaError || twitterError || spotifyError || upGenErrors) {
            showToast('error', 'Please fix the errors in the form!');
            return;
        }
        setIsSubmitted(true);
        try {
            const userData = {
                firstName: DOMPurify.sanitize(formValues.firstName),
                lastName: DOMPurify.sanitize(formValues.lastName),
                interests: formValues.interests.map(interest => DOMPurify.sanitize(interest).trim()).filter(interest => interest !== ''),
                links: {
                    imdb: DOMPurify.sanitize(formValues.links.imdb),
                    insta: DOMPurify.sanitize(formValues.links.insta),
                    twitter: DOMPurify.sanitize(formValues.links.twitter),
                    spotify: DOMPurify.sanitize(formValues.links.spotify)
                }
            };
            console.log('data >>> ', userData);
            const response = await dispatch(updateProfile(userData)).unwrap();
            console.log('after dispatch', response);
            if (response.status) {
                showToast('success', response.message);
                setIsClickedFooter(false);
            } else {
                showToast('error', response.message);
            }
        } catch (error) {
            showToast('error', 'Error updating profile!');
        } finally {
            setIsSubmitted(false);
        }
    };
    const handleDetailSubmit = async (event) => {
        event.preventDefault();
        if (isSubmittedTwo) return;
        if (ageError || heightError || locationError || professionError || genderError || drinkingError || smokingError || haveKidsError || lookingForError || datingTypeError || relationshipStatusError || eatingHabitError || bodyTypeError || detGenErrors) {
            showToast('error', 'Please fix the errors in the form!');
            return;
        }
        setIsSubmittedTwo(true);
        try {
            const detailData = {
                age: DOMPurify.sanitize(detailValues.age),
                height: DOMPurify.sanitize(detailValues.height),
                location: DOMPurify.sanitize(detailValues.location),
                profession: DOMPurify.sanitize(detailValues.profession),
                gender: DOMPurify.sanitize(detailValues.gender),
                drinking: DOMPurify.sanitize(detailValues.drinking),
                smoking: DOMPurify.sanitize(detailValues.smoking),
                haveKids: DOMPurify.sanitize(detailValues.haveKids),
                lookingFor: DOMPurify.sanitize(detailValues.lookingFor),
                datingType: DOMPurify.sanitize(detailValues.datingType),
                relationshipStatus: DOMPurify.sanitize(detailValues.relationshipStatus),
                eatingHabit: DOMPurify.sanitize(detailValues.eatingHabit),
                bodyType: DOMPurify.sanitize(detailValues.bodyType)
            };
            const response = await dispatch(updateDetails(detailData)).unwrap();
            if (response.status) {
                showToast('success', response.message);
                setIsClickedFooterTwo(false);
            } else {
                showToast('error', response.message);
            }
        } catch (error) {
            showToast('error', 'Error updating details!');
        } finally {
            setIsSubmittedTwo(false);
            setIsLocationSelected(false);
            setIsProfessionSelected(false);
        }
    };

    // useEffect(() => {
    //     const handleScroll = () => {
    //         if (isClickedFooter || isClickedFooterTwo) {
    //             setIsClickedFooter(false);
    //             setIsClickedFooterTwo(false);
    //         }
    //     };
    //     window.addEventListener('scroll', handleScroll);
    //     return () => {
    //         window.removeEventListener('scroll', handleScroll);
    //     };
    // }, [isClickedFooter, isClickedFooterTwo]);

    //password protect
    const [showPassword, setShowPassword] = useState(false);
    const seePassword = () => {
        setShowPassword(prev => !prev);
    }

    useEffect(() => {
        if (user) {
            const initialInterests = user.interests || [];
            setFormValues(prevValues => ({
                ...prevValues,
                firstName: user.firstName,
                lastName: user.lastName,
                interests: initialInterests,
                links: {
                    imdb: user.links?.imdb || '',
                    insta: user.links?.insta || '',
                    twitter: user.links?.twitter || '',
                    spotify: user.links?.spotify || ''
                }
            }));
            setSearchInterests(initialInterests.join(', '));
        };
    }, [user]);

    useEffect(() => {
        if (details) {
            setDetailValues(prevValues => ({
                ...prevValues,
                age: details.age,
                height: details.height,
                location: details.location,
                profession: details.profession,
                gender: details.gender,
                drinking: details.drinking,
                smoking: details.smoking,
                haveKids: details.haveKids,
                lookingFor: details.lookingFor,
                datingType: details.datingType,
                relationshipStatus: details.relationshipStatus,
                eatingHabit: details.eatingHabit,
                bodyType: details.bodyType
            }));
            setSearchLocation(details.location || '');
            setSearchProfession(details.profession || '');
            setIsLocationSelected(!!details.location);
            setIsProfessionSelected(!!details.profession);
        };
    }, [details]);


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
                                        {user.interests?.map((interest, index) => (
                                            <p key={index}>{interest}</p>
                                        ))}
                                    </div>
                                </div>) : (
                                    <p className='error'>Must update your profile and details only then people can see you!</p>
                                )
                            }
                            <div className="links">
                                {user.links && (
                                    <>
                                        <a href={`https://${user.links.imdb || "www.imdb.com"}`} target="_blank" rel="noopener noreferrer">
                                            <img src="https://res.cloudinary.com/dfsohhjfo/image/upload/v1729070090/JustDate/Assets/icons8-imdb-an-online-database-of-information-related-to-films_-and-television-programs-100_sbkn70.png" className={user.links.imdb ? 'filter' : ''} alt="imdb" />
                                        </a>
                                        <a href={`https://${user.links.insta || "www.instagram.com"}`} target="_blank" rel="noopener noreferrer">
                                            <img src="https://res.cloudinary.com/dfsohhjfo/image/upload/v1729070090/JustDate/Assets/icons8-instagram-100_tgb1t2.png" className={user.links.insta ? 'filter' : ''} alt="instagram" />
                                        </a>
                                        <a href={`https://${user.links.twitter || "www.x.com"}`} target="_blank" rel="noopener noreferrer">
                                            <img src="https://res.cloudinary.com/dfsohhjfo/image/upload/v1729070081/JustDate/Assets/icons8-twitter-100_pukkbt.png" className={user.links.twitter ? 'filter' : ''} alt="twitter" />
                                        </a>
                                        <a href={`https://${user.links.spotify || "open.spotify.com"}`} target="_blank" rel="noopener noreferrer">
                                            <img src="https://res.cloudinary.com/dfsohhjfo/image/upload/v1729070081/JustDate/Assets/icons8-spotify-100_wivbcr.png" className={user.links.spotify ? 'filter' : ''} alt="spotify" />
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
                                                <input type="text" name='firstName' autoComplete='name' placeholder='Enter your first name...' value={formValues.firstName} onChange={handleInputChange} />
                                                {firstNameError && <p className="error">{firstNameError.msg}</p>}
                                            </div>
                                            <div className="pagebox5 flexcol center">
                                                <input type="text" name='lastName' autoComplete='name' placeholder='Enter your last name...' value={formValues.lastName} onChange={handleInputChange} />
                                                {lastNameError && <p className="error">{lastNameError.msg}</p>}
                                            </div>
                                            <div className="pagebox5 flexcol center">
                                                <div style={{ position: 'relative' }} className='wh'>
                                                    <input type="text" name='interests' autoComplete='off' placeholder='Select your interests' value={searchInterests} onChange={handleInterestChange} />
                                                    {showInterestsDropdown && filteredInterests.length > 0 && (
                                                        <ul className='locationDropdown'>
                                                            {filteredInterests.map((interest, index) => (
                                                                <li key={index} onClick={() => handleSelectInterest(interest)} style={{ padding: '8px', cursor: 'pointer' }}>
                                                                    {interest}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                                <div className="selected-interests" style={ formValues?.interests?.length > 0 ? { display: 'flex' } : { display: 'none' }}>
                                                    {formValues.interests.map((interest, index) => (
                                                        <span key={index} className="interest-tag">
                                                            {interest} <button type="button" onClick={() => removeInterest(index)}>×</button>
                                                        </span>
                                                    ))}
                                                </div>
                                                {interestsError && <p className="error">{interestsError.msg}</p>}
                                            </div>
                                            <div className="pagebox5 flexcol center">
                                                <input type="text" name='imdb' autoComplete='off' placeholder='Enter your imdb list...' value={formValues.links?.imdb} onChange={handleInputChange} />
                                                {imdbError && <p className="error">{imdbError.msg}</p>}
                                            </div>
                                            <div className="pagebox5 flexcol center">
                                                <input type="text" name='insta' autoComplete='username' placeholder='Share your instagram handle...' value={formValues.links?.insta} onChange={handleInputChange} />
                                                {instaError && <p className="error">{instaError.msg}</p>}
                                            </div>
                                            <div className="pagebox5 flexcol center">
                                                <input type="text" name='twitter' autoComplete='username' placeholder='Share your twitter handle...' value={formValues.links?.twitter} onChange={handleInputChange} />
                                                {twitterError && <p className="error">{twitterError.msg}</p>}
                                            </div>
                                            <div className="pagebox5 flexcol center">
                                                <input type="text" name='spotify' autoComplete='off' placeholder='Share your fav playlist...' value={formValues.links?.spotify} onChange={handleInputChange} />
                                                {spotifyError && <p className="error">{spotifyError.msg}</p>}
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
                                <p className="textBig">Height :</p>
                                <p className="textBig">{details?.height ? `${details.height} Ft` : '...'}</p>
                            </div>
                            <div className="pagebox20 flex center-space">
                                <p className="textBig">Location :</p>
                                <p className="textBig">{details?.location ? details.location : '...'}</p>
                            </div>
                            <div className="pagebox20 flex center-space">
                                <p className="textBig">Profession :</p>
                                <p className="textBig">{details?.profession ? details.profession : '...'}</p>
                            </div>
                            <div className="pagebox20 flex center-space">
                                <p className="textBig">Gender :</p>
                                <p className="textBig">{details?.gender ? details.gender : '...'}</p>
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
                                <p className="textBig">Have Kids :</p>
                                <p className="textBig">{details?.haveKids ? details.haveKids : '...'}</p>
                            </div>
                            <div className="pagebox20 flex center-space">
                                <p className="textBig">Looking For :</p>
                                <p className="textBig">{details?.lookingFor ? details.lookingFor : '...'}</p>
                            </div>
                            <div className="pagebox20 flex center-space">
                                <p className="textBig">Dating Type :</p>
                                <p className="textBig">{details?.datingType ? details.datingType : '...'}</p>
                            </div>
                            <div className="pagebox20 flex center-space">
                                <p className="textBig">Relationship Status :</p>
                                <p className="textBig">{details?.relationshipStatus ? details.relationshipStatus : '...'}</p>
                            </div>
                            <div className="pagebox20 flex center-space">
                                <p className="textBig">Eating Habit :</p>
                                <p className="textBig">{details?.eatingHabit ? details.eatingHabit : '...'}</p>
                            </div>
                            <div className="pagebox20 flex center-space">
                                <p className="textBig">Body Type :</p>
                                <p className="textBig">{details?.bodyType ? details.bodyType : '...'}</p>
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
                                                <input type="number" name="height" autoComplete="off" placeholder="Enter your height (Feet.Inches e.g. 5.11 for 5 ft 11 in)" step="0.01"
                                                    value={detailValues.height} onChange={handleDetailChange} />
                                                {heightError && <p className="error">{heightError.msg}</p>}
                                            </div>

                                            <div className="pagebox5 flexcol center">
                                                <div style={{ position: 'relative' }} className='wh'>
                                                    <input type="text" name="location" placeholder="Enter your location" value={searchLocation}
                                                        onChange={handleLocationChange} autoComplete="off"
                                                    />

                                                    {showLocationDropdown && filteredLocations.length > 0 && (
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
                                                <div style={{ position: 'relative' }} className='wh'>
                                                    <input type="text" name="profession" placeholder="Enter your profession" value={searchProfession}
                                                        onChange={handleProfessionChange} autoComplete="off"
                                                    />

                                                    {showProfessionDropdown && filteredProfessions.length > 0 && (
                                                        <ul className='locationDropdown'>
                                                            {filteredProfessions.map((profession, index) => (
                                                                <li key={index} onClick={() => handleSelectProfession(profession)} style={{ padding: '8px', cursor: 'pointer' }}
                                                                >
                                                                    {profession}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                                {professionError && <p className="error">{professionError.msg}</p>}
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
                                                <select name="haveKids" value={detailValues.haveKids} onChange={handleDetailChange}>
                                                    <option value="">Do you have kids?</option>
                                                    <option value="Yes">Yes</option>
                                                    <option value="No">No</option>
                                                </select>
                                                {haveKidsError && <p className="error">{haveKidsError.msg}</p>}
                                            </div>

                                            <div className="pagebox5 flexcol center">
                                                <select name="lookingFor" value={detailValues.lookingFor} onChange={handleDetailChange}>
                                                    <option value="">I'm looking for</option>
                                                    <option value="Boys">Boys</option>
                                                    <option value="Girls">Girls</option>
                                                </select>
                                                {lookingForError && <p className="error">{lookingForError.msg}</p>}
                                            </div>
                                            <div className="pagebox5 flexcol center">
                                                <select name="datingType" value={detailValues.datingType} onChange={handleDetailChange}>
                                                    <option value="">Select dating type</option>
                                                    <option value="Serious">Serious</option>
                                                    <option value="Casual">Casual</option>
                                                </select>
                                                {datingTypeError && <p className="error">{datingTypeError.msg}</p>}
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
                                            <div className="pagebox5 flexcol center">
                                                <select name="eatingHabit" value={detailValues.eatingHabit} onChange={handleDetailChange}>
                                                    <option value="">Select your eating habit</option>
                                                    <option value="Vegan">Vegan</option>
                                                    <option value="Vegetarian">Vegetarian</option>
                                                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                                                </select>
                                                {eatingHabitError && <p className="error">{eatingHabitError.msg}</p>}
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

                </div>
            </div>
        </Fragment>
    )
}

export default Profile