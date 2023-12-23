import React, { useContext } from 'react';
import { AuthContext } from '../../context';
import { FaUser } from 'react-icons/fa';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';

const UserProfile = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="user">
      {currentUser.photoURL ? (
        <img src={currentUser.photoURL} alt="profile" />
      ) : (
        <FaUser className='user-icon' />
      )}
      <div className="cta-box">
        <span>{currentUser.displayName}</span>
        <button onClick={() => signOut(auth)}>Logout</button>
      </div>
    </div>
  )
}

export default UserProfile
