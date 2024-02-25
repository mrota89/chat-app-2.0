import React, { useMemo, useContext, useCallback } from 'react'
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import Navbar from '../navbar';
import SocialForm from '../socialForm';
import ContactList from '../contactList';
import { ActiveChatContext, ModalMobileContext } from '../../context';
import { useWindowWidth } from '../../utility/hook';

const Sidebar = () => {
  const { showChatList } = useContext(ActiveChatContext);
  const { isMobileModalOpen, setIsMobileModalOpen } = useContext(ModalMobileContext);
  const windowWidth = useWindowWidth();


  const onClickMenuButton = useCallback(() => {
    setIsMobileModalOpen((prev) => !prev);
  }, [setIsMobileModalOpen])

  const sidebar = useMemo(() => [
    "sidebar",
    showChatList ? "show" : "",
  ].filter((x) => !!x).join(" "),
    [showChatList]
  );

  console.log(isMobileModalOpen)

  return (
    <div className={sidebar}>
      {(windowWidth <= 768 && windowWidth > 481)
        ?
        <div className="button-mobile-navbar">
          {isMobileModalOpen ? (
            <FaChevronLeft
              className="circle-chevron icon"
              onClick={onClickMenuButton}
            />
          ) : (
            <FaChevronRight
              className="circle-chevron icon"
              onClick={onClickMenuButton}
            />
          )}
        </div>
        :
        <>
          <Navbar />
          <SocialForm />
        </>
      }
      <ContactList />
    </div>
  )
}

export default Sidebar;