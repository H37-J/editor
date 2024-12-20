import { date } from '@/utils/date';
import { CiStickyNote } from 'react-icons/ci';
import { useRouter } from 'next/router';
import { v4 } from 'uuid';
import { usePost } from '@/hooks/usePost';
import api from '@/utils/api';
import SideNoteList from '@/pages/components/ui/note/SideNoteList';
import { DefaultEditorContent } from '@/utils/constant';

const Page = () => {
  const router = useRouter();
  const uuid = v4();
  const postUtils = usePost();
  const { data: posts, isLoading } = api.post.getAll.useQuery(undefined, {});

  const postCreate = async () => {
    await postUtils.upsertPost({
      uuid: uuid,
      content: DefaultEditorContent,
      title: '제목 없음',
    });
    await router.push(`/note/${uuid}`);
  };

  if (isLoading) {
    return null;
  }

  return (
    <>
      {posts && posts.length > 0 ? (
        <>
          <SideNoteList />
        </>
      ) : (
        <>
          <div className="flex h-full justify-center items-center flex-1 bg-gradient-to-r from-[#222126] from-5% via-[#29282a] via-50% to-[#2b292d] to-100%">
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
