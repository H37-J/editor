import { FaRegStar } from 'react-icons/fa';
import { IoHomeOutline } from 'react-icons/io5';
import { MdOutlineStickyNote2 } from 'react-icons/md';
import { GrNotes } from "react-icons/gr";
import SideMenu from '@/pages/components/layout/SideMenu';
import useAuth from '@/hooks/useAuth';

const NavBar = () => {
  const { signIn, signOut, session } = useAuth();
  
  return (
    <>
      <div className="w-16  md:w-80 border rounded-md text-red border-r border-neutral-750 fixed left-1.5 top-1.5 bottom-1.5">
        <div className="flex space-x-2 items-center sm:py-2.5 px-4 text-sm">
          <img className="rounded-full w-7 h-7 mt-1" src={session?.user.image} alt="image description"/>
          <div className="flex flex-col text-xs text-gray-300 flex-1">
            <div>{session?.user.name}</div>
            <div>{session?.user.email}</div>
          </div>
          <div onClick={() => signOut()} className={`hover:text-gray-300 cursor-pointer text-xs ${session?.user.email ? 'pb-3' : ''}`}>
            로그아웃
          </div>
        </div>
        <nav className="mt-1">
          <SideMenu Icon={IoHomeOutline} link={'/'} content={'홈'} />
          <SideMenu
            Icon={MdOutlineStickyNote2}
            link={'/note'}
            content={'노트'}
          />
          <SideMenu Icon={GrNotes} link={'/mynote'} content={'내 노트'} />
          <SideMenu Icon={FaRegStar} link={'/'} content={'바로가기'} />
        </nav>
      </div>
    </>
  );
};

export default NavBar;
