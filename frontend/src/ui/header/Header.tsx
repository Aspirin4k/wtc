import React, { Component } from "react";
import { Link } from 'react-router-dom';

interface HeaderProps {

}

interface HeaderState {

}

class Header extends Component<HeaderProps, HeaderState> {
    render() {
        return <div className={'page-header'}>
            <div className={'page-header__container'}>
                <Link className={'page-header-logo'} to={'/'}>
                    <img className={'page-header-logo-img'} alt={'When They Cry'} src={'/common/logo.webp'} />
                </Link>
            </div>
        </div>;
    }
}

export { Header }