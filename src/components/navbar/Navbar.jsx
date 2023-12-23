import React, { useContext, useEffect } from 'react';
import UserProfile from '../userProfile';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { ModalContext, ModalMobileContext } from '../../context';
import { useWindowWidth } from '../../utility/hook';

const Navbar = () => {
  const windowWidth = useWindowWidth();
  const { isModalOpen, setIsModalOpen } = useContext(ModalContext);
  const { setIsMobileModalOpen } = useContext(ModalMobileContext);

  const onClickModalButton = () => {
    setIsModalOpen(prev => !prev);
  };

  useEffect(() => {
    if (windowWidth < 992) {
      setIsModalOpen(false);
      setIsMobileModalOpen(false);
    }
  }, [windowWidth, setIsModalOpen, setIsMobileModalOpen]);

  return (
    <div className="navbar">
      <UserProfile />
      {isModalOpen ? (
        <FaChevronUp className="icon" onClick={onClickModalButton} />
      ) : (
        <FaChevronDown className="icon" onClick={onClickModalButton} />
      )}
    </div>
  );
};

export default Navbar;
