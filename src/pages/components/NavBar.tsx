import { FaRegStar } from 'react-icons/fa';
import { IoHomeOutline } from 'react-icons/io5';
import { MdOutlineStickyNote2 } from 'react-icons/md';

import SideMenu from '@/pages/components/SideMenu';

const NavBar = () => {

  return (
    <>
      <div className="w-16 md:w-64 border rounded-md text-red border-r bg-dark-2 border-neutral-750 fixed left-1.5 top-1.5 bottom-1.5">
        <nav className="mt-10">
          <SideMenu
            Icon={IoHomeOutline}
            link={'/'}
            content={'홈'} />
          <SideMenu
            Icon={MdOutlineStickyNote2}
            link={'/note'}
            content={'노트'}
          />
          <SideMenu
            Icon={FaRegStar}
            link={'/'}
            content={'바로가기'} />
        </nav>
      </div>
    </>
  );
};

export default NavBar;
