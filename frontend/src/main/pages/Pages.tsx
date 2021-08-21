import React, { Component } from 'react';
import { Link } from 'react-router-dom';

interface PagesProps {
    pages_count?: number
    current_page?: number
}

interface PagesState {
}

class Pages extends Component<PagesProps, PagesState> {
    render() {
        const { pages_count, current_page } = this.props;

        let pages;
        if (pages_count <= 5) {
            pages = Array.from({length: pages_count}, (_, i) => i + 1);
        } else if (current_page <= 4) {
            pages = [1, 2, 3, 4, 5, '...', pages_count];
        } else if (current_page > 4 && current_page < pages_count - 4) {
            pages = [1, '...', current_page - 2, current_page - 1, current_page, current_page + 1, current_page + 2, '...', pages_count];
        } else {
            pages = [1, '...', pages_count - 5, pages_count - 4, pages_count - 3, pages_count - 2, pages_count - 1, pages_count];
        }

        return <div className='page-pages'>
            {
                pages.map((val, index) => {
                    return <span key={index} className={"page-pages__ref" + (val === current_page ? " page-pages__ref_active" : "")}>
                        {
                            val !== '...'
                                ? <Link to={`/page/${val}`}>
                                    {val}
                                </Link>
                                : <span>{val}</span>
                        }
                    </span>;
                })
            }
        </div>;
    }
}

export { Pages };
