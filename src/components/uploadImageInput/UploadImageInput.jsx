import React, { useEffect, useState } from 'react';
import { FaUserPlus } from 'react-icons/fa';

const UploadImageInput = () => {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const onImageChange = (e) => {
    setImage(e.target.files[0]);
  }

  useEffect(() => {
    if (!image) return;
    setImageUrl(URL.createObjectURL(image));
  }, [image]);

  return (
    <>
      <input
        style={{ display: 'none' }}
        multiple accept='image/*'
        onChange={onImageChange}
        type='file'
        id='file'
      />
      <label htmlFor='file'>
        {imageUrl ?
          (
            <>
              <img
                src={imageUrl} alt='user'
                className='icon-register'
                style={{
                  borderRadius: '50px',
                  objectFit: 'cover',
                }}
              />
              <span>Cambia immagine profilo</span>
            </>
          ) : (
            <>
              <FaUserPlus className='icon-register' />
              <span>Aggiungi immagine profilo</span>
            </>
          )}
      </label>
    </>
  )
};

export default UploadImageInput