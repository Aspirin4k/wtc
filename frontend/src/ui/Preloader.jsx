import React, {Component} from 'react';

export class Preloader extends Component {
    render () {
        return <div className='preloader'>
            <img width={64} height={64} src={'/icon/preloader.svg'} alt='Loading' />
        </div>
    }
}
