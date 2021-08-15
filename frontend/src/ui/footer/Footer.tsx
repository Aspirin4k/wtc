import React, { Component } from "react";

interface FooterProps {

}

interface FooterState {

}

class Footer extends Component<FooterProps, FooterState> {
    render() {
        return <div className={'page-footer'}>
            <div className={'page-footer__container'}>
                <div className={'page-footer-rights'}>&copy; Все права защищены СНГ сообществом ценителей работ Рюкиси07</div>
            </div>
        </div>
    }
}

export { Footer }