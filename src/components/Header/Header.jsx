import './Header.scss';
import { useState, useEffect, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../slices/authSlice';
import { showToast } from '../Schema';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';


const Header = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    const logoutHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(logout());
            sessionStorage.clear();
            showToast('success', 'Logout Successfully!');
            navigate('/login');
        } catch (error) {
            showToast('error', 'Something went wrong!');
        }
    }

    useEffect(() => {
        const navbarMenu = document.getElementById("menu");
        const burgerMenu = document.getElementById("burger");
        const headerMenu = document.getElementById("header");

        const handleBurgerClick = () => {
            burgerMenu.classList.toggle("is-active");
            navbarMenu.classList.toggle("is-active");
        };

        const handleLinkClick = () => {
            burgerMenu.classList.remove("is-active");
            navbarMenu.classList.remove("is-active");
        };

        const handleScroll = () => {
            if (window.scrollY >= 85) {
                headerMenu.classList.add("on-scroll");
            } else {
                headerMenu.classList.remove("on-scroll");
            }
        };

        const handleResize = () => {
            if (window.innerWidth > 768 && navbarMenu.classList.contains("is-active")) {
                navbarMenu.classList.remove("is-active");
            }
        };

        burgerMenu.addEventListener("click", handleBurgerClick);

        document.querySelectorAll(".menu-link").forEach((link) => {
            link.addEventListener("click", handleLinkClick);
        });

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleResize);

        return () => {
            burgerMenu.removeEventListener("click", handleBurgerClick);
            document.querySelectorAll(".menu-link").forEach((link) => {
                link.removeEventListener("click", handleLinkClick);
            });
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <Fragment>
            <header className="header" id="header">
                <nav className="navbar container">
                    <div className='headerBox'>
                        <div className="burger" id="burger">
                            <span className="burger-line"></span>
                            <span className="burger-line"></span>
                            <span className="burger-line"></span>
                        </div>
                        <a href="/" className="brand"><img src="https://res.cloudinary.com/dfsohhjfo/image/upload/v1728990993/JustDate/Assets/Picsart_24-10-15_16-30-38-262_pomjlt.png" alt="JustDate" /></a>
                    </div>

                    <div className="menu" id="menu">
                        <ul className="menu-inner">
                            <li className="menu-item"><a href="/discover" className="menu-link">Discover</a></li>
                            {/* <li className="menu-item"><a href="/about-us" className="menu-link">About us</a></li>
                            <li className="menu-item"><a href="/contact-us" className="menu-link">Contact us</a></li> */}
                            <li className="menu-item">
                                <a href="/profile" className="menu-link main-div" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                                    Account <KeyboardArrowDownIcon />
                                    <div className={`hover-div ${isHovered ? 'visible' : ''}`}>
                                        <a href='/profile' className='text'>Profile</a>
                                        <a href='/chats' className='text'>Chats</a>
                                        <a href='/likes' className='text'>Likes</a>
                                        <a onClick={logoutHandler} className='text'>Logout</a>
                                        {/* <a onClick={deleteAccount} className='text'>Delete Account</a> */}
                                    </div>
                                </a>
                            </li>
                            <li className="menu-item mlink"><a href="/profile" className="menu-link">Profile</a></li>
                            <li className="menu-item mlink"><a href="/chats" className="menu-link">Chats</a></li>
                            <li className="menu-item mlink"><a href="/likes" className="menu-link">Likes</a></li>
                            <li className="menu-item mlink"><a onClick={logoutHandler} className="menu-link">Logout</a></li>
                            {/* <li className="menu-item mlink"><a onClick={deleteAccount} className="menu-link">Delete Account</a></li> */}
                        </ul>
                    </div>
                    {/* <a href="/contact-us" className="menu-block">Sign up &nbsp;&nbsp; <EastIcon /></a> */}
                </nav>
            </header>
        </Fragment>
    )
};

export default Header;