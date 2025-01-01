import { FaRegStar } from 'react-icons/fa';
import { IoHomeOutline } from 'react-icons/io5';
import { MdOutlineStickyNote2 } from 'react-icons/md';
import { GrNotes } from 'react-icons/gr';
import SideMenu from '@/pages/components/layout/SideMenu';
import useAuth from '@/hooks/useAuth';
import { IoLogOutOutline } from 'react-icons/io5';
import { IoMdArrowRoundBack } from "react-icons/io";
import { useEditorStore } from '@/store/zustand/editorStore';
const NavBar = ({editor}: {editor?: boolean}) => {
  const {  signOut, session } = useAuth();

  return (
    <>
      <div className="md:w-72 border rounded-none border-r border-neutral-750 fixed md:left-1.5 md:top-1.5 md:bottom-1.5 md:rounded-md bottom-0 left-0 w-full z-50">
        <div className="space-x-2 items-center sm:py-2.5 px-4 text-sm mb-2 hidden md:flex">
          <img
            className="rounded-full w-7 h-7 mt-1"
            onError={(e) => (e.currentTarget.style.display = 'none')}
            src={session?.user.image}
            alt="이미지 없음"
          />
          <div className="flex flex-col text-xs text-gray-300 flex-1">
            <div>{session?.user.name}</div>
            <div>{session?.user.email}</div>
          </div>
          <div
            onClick={() => signOut()}
            className={`hover:text-gray-300 cursor-pointer text-xs ${session?.user.email ? 'pb-3' : ''}`}
          >
            로그아웃
          </div>
        </div>
        <nav className="flex h-full md:block md:bg-transparent bg-neutral-800 md:space-y-1 z-50">
          <SideMenu className={''} Icon={IoHomeOutline} link={'/'} content={'홈'} />
          <SideMenu className={''}
            Icon={MdOutlineStickyNote2}
            link={'/note'}
            content={'노트'}
          />
          <SideMenu className={''} Icon={GrNotes} link={'/mynote'} content={'내 노트'} />
          {editor ? (<SideMenu onClick={() => useEditorStore.getState().setShowNote(false)} className={'block md:hidden'} Icon={IoMdArrowRoundBack} link={'/note'} content={'뒤로'} />) : (<SideMenu onClick={signOut} className={'block md:hidden'} Icon={IoLogOutOutline} link={'/'} content={'로그아웃'} />)}
        </nav>
      </div>
    </>
  );
};

export default NavBar;
