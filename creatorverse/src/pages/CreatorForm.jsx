import React, {useEffect, useState} from 'react'
import { supabase } from '../client'
import { useNavigate, useParams } from 'react-router-dom';

import '../css/addCreator.css'
export const AddCreator = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [url, setUrl] = useState('');
    const [file, setFile] = useState(null);
    const [missingFields, setMissingFields] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    useEffect(() => {
      if (isEditMode) {
      // Logic for fetching existing creator details and populating the form
      supabase.from('creators').select('*').eq('id', id).single().then(({data, error}) => {
          if (error) {
              console.error('Error fetching creator details:', error);
          } else {
              setName(data.name);
              setDescription(data.description);
              setUrl(data.url);
          } 
        });
      } 
    }, [])

    const submit = async (e) => {
        e.preventDefault();
        // handle form submission for edit
        if (isEditMode) {
            const {data: updateData, updateError} = await supabase.from('creators').select('imageURL').eq('id', id).single();
            let imageURL = updateData.imageURL;
          if (file) {
            const bucket = 'CreatorImages';
              const path = `${id}/${Date.now()}_${file.name}`;
              // Delete previous image
              const { data, error } = await supabase
                .storage
                .from('CreatorImages')
                .remove([imageURL])
              // upload image to supabase storage
              const { data: uploadData, error: uploadError } = await supabase
                .storage
                .from(bucket)
                .upload(path, file)
              
              // getImage public url
              const { data: publicUrlData } = supabase
                .storage
                .from(bucket)
                .getPublicUrl(path);

              imageURL = publicUrlData.publicUrl;
          }

          const { data, error } = await supabase
            .from('creators')
            .update({
                name: name,
                description: description,
                url: url,
                imageURL: imageURL
            })
            .eq('id', id)
            .select()
            .single();
        
          setName('');
          setDescription('');
          setUrl('');
          setFile(null);
          navigate('/'); 
        return;
        }
        
        // handle form submission for add new row
       
        if (!file || name.trim() === '' || description.trim() === '' || url.trim() === '') {
          setMissingFields(true);
          return
        }
        
        const { data, error } = await supabase
          .from('creators')
          .insert([
              {
                  name: name,
                  description: description,
                  url: url,
              }
          ]).select().single();

        if (error) {
          console.error(error);
          return
        }
        
        // Get ID to use for storage path for image
        let creation_id = data.id;
        const bucket = 'CreatorImages'; 
        const path = `${creation_id}/${Date.now()}_${file.name}`; 

        // upload image to supabase storage
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from(bucket)
          .upload(path, file)
        if (uploadError) {
          console.error(uploadError);
          return
        }
        const { data: publicUrlData } = supabase
          .storage
          .from(bucket)
          .getPublicUrl(path);

        const publicUrl = publicUrlData.publicUrl;


        const { error: imageURLupdateError } = await supabase
          .from('creators')
          .update({ imageURL: publicUrl })
          .eq('id', creation_id)

      if (imageURLupdateError) {
        console.error("Update error:", imageURLupdateError)
        return
      }
        setName('');
        setDescription('');
        setUrl('');
        setFile(null);
        navigate('/'); 
    }

    return (
        <div className="addCreator-page">
            {!isEditMode && <h1> <center> Add a New Creator </center> </h1>}
            {isEditMode && <h1> <center> Edit Creator </center> </h1>}
            <form onSubmit={submit}>
              <div className='addCreatorForm'>
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <br />
                <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                <br />
                <input type="text" placeholder="platform.com/example" value={url} onChange={(e) => setUrl(e.target.value)} />
                <br />
                <input type="file" accept='image/*' onChange={(e) => setFile(e.target.files[0])} />
                {missingFields && <p className="error">Please fill in all fields and select an image.</p>}
                <div className='addCreatorFormButtons'>
                  <button type="button" onClick={() => navigate(-1)}>Cancel</button>
                  <button type="submit">Submit</button>
                </div>
              </div>
            </form>            
        </div>
    )
}


