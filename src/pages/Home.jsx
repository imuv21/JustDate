import { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { showToast } from '../components/Schema';
import { useDispatch, useSelector } from 'react-redux';
import { getPeople, likeUser } from '../slices/socialSlice';

import Loader from '../components/Loader/Loader';
import HeightIcon from '@mui/icons-material/Height';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import CakeIcon from '@mui/icons-material/Cake';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';


const Home = () => {

  const dispatch = useDispatch();
  const { people, pepLoading, pepError, totalResults, totalPages, pagePeople, isFirst, isLast, hasNext, hasPrevious, likLoading } = useSelector((state) => state.social);
  const { user } = useSelector((state) => state.auth);
  const [liked, setLiked] = useState({});
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(2);
  const [order, setOrder] = useState("asc");

  useEffect(() => {
    dispatch(getPeople({ page, size, order }));
  }, [dispatch, page, size, order]);

  //pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };
  const getPageNumbers = (currentPage, totalPages) => {
    const pageNumbers = [];
    const maxPageButtons = 5;

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (endPage - startPage < maxPageButtons - 1) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxPageButtons + 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };
  const pageNumbers = getPageNumbers(page, totalPages);

  const toggleOrder = () => {
    setOrder(prevOrder => (prevOrder === "asc" ? "desc" : "asc"));
  };

  useEffect(() => {
    if (people && user) {
      const initialLikedState = {};
      people.forEach((person) => {
        initialLikedState[person._id] = person?.likes?.includes(user._id);
      });
      setLiked(initialLikedState);
    }
  }, [people, user]);

  const handleLikeClick = async (personId) => {
    if (!liked[personId]) {
      try {
        const response = await dispatch(likeUser({ likedUserId: personId })).unwrap();
        if (response.status) {
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

  if (pepLoading) {
    return <Loader />;
  }

  return (
    <Fragment>
      <Helmet>
        <title>Home Page | JustDate - Find Genuine Connections Today</title>
        <meta name="description" content="JustDate is a modern dating platform designed to help you meet real people seeking meaningful relationships. Join today and start connecting with like-minded individuals for friendship, romance, or commitment." />
        <link rel="canonical" href="https://justdate.netlify.app/" />
      </Helmet>
      <div className='page flexcol wh'>

        <div className="sortCat">
          <div className="flexcol">
            <h1 className="heading">Discover people</h1>
            <p className="text">Showing {pagePeople || 0} of {totalResults || 0} products</p>
          </div>
          <div className="flex center g10">
            <div className="orderfilter" onClick={toggleOrder}>
              {order === "asc" ? <NorthIcon /> : <SouthIcon />}
            </div>
          </div>
        </div>

        <div className="discoverGrid">

          {pepError ? (<p className='text'>Error loading users!</p>) : !pepLoading && !pepError &&
            people && people.length > 0 ? people.map((person) => (
              <div className="disGridItem" key={person._id}>
                <p className='textBig'>{person.firstName} {person.lastName}</p>
                <div className="interestsTwo">
                  {person.interests?.map((interest, index) => (
                    <p key={index} className="text">{interest.trim() || '...'}</p>
                  ))}
                </div>
                <div className="details">
                  <div className='subdetail'><CakeIcon /><p className='textBig'>{person?.age} Yrs</p></div>
                  <div className='subdetail'><HeightIcon /><p className='textBig'>{person?.height} Ft</p></div>
                  <div className='subdetail'><EmojiPeopleIcon /> <p className='textBig'>{person?.bodyType}</p></div>
                </div>
                <div className="linksTwo">

                  <div className={`likeButton ${likLoading ? 'disabled' : ''}`} onClick={() => handleLikeClick(person._id)}>
                    {liked[person._id] ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
                  </div>

                  <div className="flex g5">
                    {person.links?.imdb && (
                      <a href={`https://${person.links.imdb}`} target="_blank" rel="noopener noreferrer">
                        <img src="https://res.cloudinary.com/dfsohhjfo/image/upload/v1729070090/JustDate/Assets/icons8-imdb-an-online-database-of-information-related-to-films_-and-television-programs-100_sbkn70.png" alt="imdb" />
                      </a>
                    )}
                    {person.links?.insta && (
                      <a href={`https://${person.links.insta}`} target="_blank" rel="noopener noreferrer">
                        <img src="https://res.cloudinary.com/dfsohhjfo/image/upload/v1729070090/JustDate/Assets/icons8-instagram-100_tgb1t2.png" alt="instagram" />
                      </a>
                    )}
                    {person.links?.twitter && (
                      <a href={`https://${person.links.twitter}`} target="_blank" rel="noopener noreferrer">
                        <img src="https://res.cloudinary.com/dfsohhjfo/image/upload/v1729070081/JustDate/Assets/icons8-twitter-100_pukkbt.png" alt="twitter" />
                      </a>
                    )}
                    {person.links?.spotify && (
                      <a href={`https://${person.links.spotify}`} target="_blank" rel="noopener noreferrer">
                        <img src="https://res.cloudinary.com/dfsohhjfo/image/upload/v1729070081/JustDate/Assets/icons8-spotify-100_wivbcr.png" alt="spotify" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )) : (<p className='text'>No users found!</p>)}
        </div>

        {!pepLoading && !pepError && totalResults > size && (
          <div className="pagination">
            <div className="flex wh" style={{ gap: '10px' }}>
              <button className='pagination-btn' onClick={() => handlePageChange(1)} disabled={isFirst}>
                First Page
              </button>
              <button className='pagination-btn' onClick={() => handlePageChange(page - 1)} disabled={!hasPrevious}>
                Previous
              </button>
            </div>
            <div className="flex wh" style={{ gap: '10px' }}>
              {pageNumbers.map(index => (
                <button key={index} className={`pagination-btn ${index === page ? 'active' : ''}`} onClick={() => handlePageChange(index)}>
                  {index}
                </button>
              ))}
            </div>
            <div className="flex wh" style={{ gap: '10px' }}>
              <button className='pagination-btn' onClick={() => handlePageChange(page + 1)} disabled={!hasNext}>
                Next
              </button>
              <button className='pagination-btn' onClick={() => handlePageChange(totalPages)} disabled={isLast}>
                Last Page
              </button>
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Home;