import { useNavigate } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import Creator from '../components/creator';
import { supabase } from '../client'


import '../css/ShowCreators.css'

export default function Creators() {
    
    const navigate = useNavigate();
    const creatorsRef = useRef(null);
    const [creators, setCreators] = useState([]);

    const scrollDown = () => {
        // TODO: Check if creators exist before scrolling
        creatorsRef.current?.scrollIntoView({ 
        behavior: 'smooth' 
        })
    }

    const addCreator = () => {
        navigate('/add-creator');
    }

    useEffect(()=> {
        const fetchCreators = async () => {
        const {data, error} = await supabase
            .from('creators')
            .select('*')

        if (error) {
            console.error('Error fetching creators:', error)
        } else {
            console.log('Fetched creators:', data)
            setCreators(data);        
        }
    }
    fetchCreators()
  }, [])

    return (
        <div className="showCreators-page">
            <div className="landing-photo">
            <div className="options">
                <button onClick={() => scrollDown()}> View List </button>
                <button onClick={() => addCreator()}> Add Creator </button>
            </div>
            </div>

            <div id='creators' ref={creatorsRef}>
                <div className='row'>
                    {creators.map((creator) => (
                        <div className='col' key={creator.id}>
                            <div className="creator-card col-12 col-md-6 mb-4">
                                <Creator name={creator.name} description={creator.description} url={creator.url} imageURL={creator.imageURL} id={creator.id} />
                            </div>
                        </div>
                    ))
                }
                </div>
            </div>
        </div>
    )
}