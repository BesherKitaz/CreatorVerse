
import { useParams } from "react-router-dom"
import Modal from "../components/deleteModal"
import { supabase } from "../client";
import '../css/creatorDetails.css'
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react"


export default function CreatorDetails() {

    const { id } = useParams();
    const [creatorDetails, setCreatorDetails] = useState(null);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    function handleEdit() {
        // Logic for editing creator details
        navigate(`/edit-creator/${id}`);
    }

    function handleModalOpen() {
        setOpen(true);
    }

    function DeleteCreator() {
        // Logic for deleting the creator
        supabase.from('creators').delete().eq('id', id).then(({data, error}) => {
            if (error) {
                console.error('Error deleting creator:', error);
            } else {
                console.log('Creator deleted:', data);
                // Redirect or update UI after deletion
                navigate('/'); // Redirect to creators list
            }
        });
    }
    function goBack() {
        navigate(-1);
    }

    useEffect(() => {
        const fetchCreatorDetails = async () => {
            // Fetch creator details using the id from supabase
            const { data, error } = await supabase.from('creators').select('*').eq('id', id).single();
            if (error) {
                console.error('Error fetching creator details:', error);
            } else {
                setCreatorDetails(data);
            }
        }
        fetchCreatorDetails();
    }, [id])
    useEffect(() => {
        console.log("Modal open state:", open);
    }, [open]);

    useEffect(() => {console.log(creatorDetails);
    }, [creatorDetails])
    return (
        <>
            <Modal isOpen={open} onClose={() => setOpen(false)}>
                <h2>Delete Creator {creatorDetails?.name}?</h2>
                <div className="modal-options">
                    <button onClick={() => setOpen(false)}>Cancel</button>
                    <button onClick={() => DeleteCreator()}>Delete</button>
                </div>
            </Modal>
            
            <img src={creatorDetails?.imageURL} className="float-right" alt="My image" />
            <div className="creatorDetails-container">

                <h1> { creatorDetails?.name}</h1>
                <p>{ creatorDetails?.description}</p>
                <a href={creatorDetails?.url} target="_blank" rel="noopener noreferrer">Visit Website</a>
                <div className="options">
                    <button className="back-button" onClick={() => goBack()}> Back</button>
                    <button className="edit-button" onClick={() => handleEdit()}>Edit</button>
                    <button className="delete-button" onClick={() => handleModalOpen()}>Delete</button>    
                </div> 
            </div>
        </>

    )
}