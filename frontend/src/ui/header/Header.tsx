import React, { Component } from "react";
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

import { User, showAuthorizationWidget } from "../../utils/authorization";
import { getConfigValue } from "../../utils/config";

interface HeaderProps {
    user: User | null,
}

interface HeaderState {
}

class Header extends Component<HeaderProps, HeaderState> {
    constructor(props) {
        super(props);

        this.handleLoginClick = this.handleLoginClick.bind(this);
    }

    handleLoginClick() {
        const isAuthorized = !!this.props.user;
        if (isAuthorized) {
            Cookies.remove('auth_token');
            window.location.replace(getConfigValue('xsolla_login_callback_url', 'http://127.0.0.1:3001'));
        } else {
            showAuthorizationWidget();
        }
    }

    render() {
        const {user} = this.props;

        return <div className={'page-header'}>
            <div className={'page-header__container'}>
                <Link className={'page-header-logo'} to={'/'}>
                    <img className={'page-header-logo-img'} alt={'When They Cry'} src={'/common/logo.webp'} />
                </Link>
                <button onClick={this.handleLoginClick} className={'page-header-login'}>
                    <img className={'page-header-login-img'} alt={'Login'} src={user?.picture ? user.picture : '/common/Login.png'} />
                </button>
            </div>
        </div>;
    }
}

export { Header }