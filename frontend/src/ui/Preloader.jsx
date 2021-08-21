import React, {Component} from 'react';

import {getStaticURL} from "../utils/static";

export class Preloader extends Component {
    render () {
        return <div className='preloader'>
            <img width={64} height={64} src={getStaticURL('/icon/preloader.svg')} alt='Loading' />
        </div>
    }
}
