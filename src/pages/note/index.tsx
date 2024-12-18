import { date } from '@/utils/date';
import { CiStickyNote } from 'react-icons/ci';
import { useRouter } from 'next/router';
import { v4 } from 'uuid';
import { usePost } from '@/hooks/usePost';
import api from '@/utils/api';
import SideNoteList from '@/pages/components/ui/note/SideNoteList';

const Page = () => {
  const router = useRouter();
  const uuid = v4();
  const postUtils = usePost();
  const temp =
    '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}';
  const { data: posts } = api.post.getAll.useQuery(undefined, {});

  const postCreate = async () => {
    await postUtils.upsertPost({
      uuid: uuid,
      content: temp,
      title: '제목 없음',
    });
    await router.push(`/note/${uuid}`);
  };

  return (
    <>
      {posts && posts.length > 0 ? (
        <>
          <SideNoteList />
        </>
      ) : (
        <>
          <div className="flex justify-center items-center flex-1 bg-gradient-to-r from-[#222126] from-5% via-[#29282a] via-50% to-[#2b292d] to-100%">
            <div
              onClick={() => postCreate()}
              className="flex flex-col items-center cursor-pointer"
            >
              <CiStickyNote className="h-[100px] w-[100px] text-emerald-500 hover:text-emerald-600" />
              <div className="ai-text text-4xl cursor-pointer">
                첫 노트 만들기
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Page;
