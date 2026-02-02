import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import '../css/ShowCreators.css'
export default function Creator({ name, description, url, imageURL, id }) {

    const navigate = useNavigate();  

    return (
        <div style={{backgroundImage: `url(${imageURL})`}} className="creator-card" onClick={() => navigate(`/creator/${id}`)}>
            <div className="details">
                <h1> {name} </h1>
                <p> <a href={url} target="_blank" rel="noopener noreferrer">Online Page</a> </p>
            </div>
        </div>
    )
}

