import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Pages extends Component {
    render() {
        const { pages_count } = this.props;

        return <div>
            {
                (new Array(pages_count || 0)).fill(null).map((val, index) => {
                    return <span key={index} className="page-ref">
                      <Link to={`/page/${index + 1}`}>
                        {index + 1}
                      </Link>
                    </span>;
                })
            }
        </div>;
    }
}

export { Pages };
