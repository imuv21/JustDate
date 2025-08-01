import { Fragment } from 'react';
import Header from './Header/Header';
import Footer from './Footer';


const Layout = ({ children }) => {

    return (
        <Fragment>
            <Header />
            {children}
            <Footer />
        </Fragment>
    );
};

export default Layout;