import { CiTrash } from 'react-icons/ci';
import { date } from '@/utils/date';
import React, { useState } from 'react';
import { usePost } from '@/hooks/usePost';
import { useRouter } from 'next/router';
import api from '@/utils/api';
import { v4 } from 'uuid';
import { DefaultEditorContent } from '@/utils/constant';
import { useEditorStore } from '@/store/zustand/editorStore';

const SideNoteList = ({className}: {className?: string}) => {
  const uuid = v4();
  const postUtils = usePost();
  const router = useRouter();
  const [showTrash, setShowTrash] = useState(false);
  const [open, setOpen] = useState(false);

  const { data: posts } = api.post.getAll.useQuery(undefined, {
    enabled: router.isReady,
  });

  const postCreate = async () => {
    useEditorStore.getState().setShowNote(true);
    await postUtils.createPost({
      uuid: uuid,
      content: DefaultEditorContent,
      title: '제목 없음',
    });
    await router.push(`/note/${uuid}`);
  };

  const delete_ = async (uuid: string) => {
    await postUtils.deleteByUUid(uuid);
    await router.push('/note');
  };

  const note = async (uuid: string) => {
    useEditorStore.getState().setShowNote(true);
    await router.push(`/note/${uuid}`);
  }

  return (
    <div className={`w-full md:w-[400px] p-3 px-4 overflow-auto h-full bg-gradient-to-r from-[#222126] from-5% via-[#29282a] via-50% to-[#2b292d] to-100% ${className} transition-transform duration-300 ${open}`}>
      <div>
        <div className="text-xl flex justify-between items-center">
          <h2>노트</h2>
          <div className="flex space-x-1.5">
            <div
              onClick={() => postCreate()}
              className="text-xs hover:text-gray-300 cursor-pointer"
            >
              새 노트
            </div>
            <div
              onClick={() => setShowTrash(!showTrash)}
              className="text-xs hover:text-gray-300 cursor-pointer"
            >
              {showTrash ? '취소' : '삭제'}
            </div>
          </div>
        </div>
        {posts && <div className="text-sm text-zinc-500 mt-1">{posts.length}개의 노트</div>}
        <div
          className={`flex justify-between text-xs mt-6 py-2 ${showTrash ? 'pl-7' : ''}`}
        >
          <div>제목</div>
          <div>업데이트</div>
        </div>
        <div
          className={`border-t border-neutral-750 ${showTrash ? 'ml-7' : ''}`}
        ></div>
        <span id="post-list">
          {posts?.map((post) => {
            return (
              <div id={post.uuid} key={post.id} className="flex items-center space-x-3">
                {showTrash && (
                  <CiTrash
                    onClick={() => delete_(post.uuid)}
                    className="w-[16px] h-[16px] cursor-pointer hover:text-red-600"
                  />
                )}
                <div
                  id=""
                  onClick={() => note(post.uuid)}
                  className="flex flex-1 justify-between text-xs py-3 md:py-2.5 font-normal border-b border-neutral-750 hover:bg-zinc-800 cursor-pointer"
                >
                  <div>{post.title}</div>
                  <div className="flex space-x-6 items-center">
                    <div>{date(post.updateDate)}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </span>
      </div>
    </div>
  );
}

export default SideNoteList;