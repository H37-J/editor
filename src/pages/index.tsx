import useAuth from '@/hooks/useAuth';
import React, { useEffect, useState } from 'react';
import api from '@/utils/api';
import { formatDate, formatDateExcludeTime } from '@/utils/date';
import { useRouter } from 'next/router';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { editorConfig } from '@/pages/note/[slug]';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import ContentPlugin from '@/editor/plugins/ContentPlugin';
import { GrNotes } from 'react-icons/gr';
import { DefaultEditorContent } from '@/utils/constant';
import { usePost } from '@/hooks/usePost';
import { v4 } from 'uuid';
import { useModal } from '@/pages/components/modal/Modal';
import GalleryModal from '@/pages/components/modal/GalleryModal';

const Page = () => {
  const { session } = useAuth();
  const { data: posts } = api.post.getTakeAll.useQuery(10, {});
  const { data: recentPost } = api.post.getTakeAll.useQuery(6, {});
  const [modal, showModal] = useModal();
  const router = useRouter();
  const postUtils = usePost();
  const uuid = v4();

  const postCreate = async () => {
    await postUtils.upsertPost({
      uuid: uuid,
      content: DefaultEditorContent,
      title: '제목 없음',
    });
    await router.push(`/note/${uuid}`);
  };

  const openModal = (image: string) => {
    showModal('이미지', (onClose) => (
      <GalleryModal image={image} />
    ))
  }
  return (
    <>
      {modal}
      <div className="flex flex-col flex-1 h-full overflow-auto p-10 bg-gradient-to-r from-[#222126] from-5% via-[#29282a] via-50% to-[#2b292d] to-100%">
        <div className="flex">
          <div className="flex-1 space-y-1">
            <div className="text-neutral-400 text-xs">
              노트를 시작할 준비 되셨나요?
            </div>
            <div className="text-2xl font-bold">235412 님의 홈</div>
          </div>
          {session ? (
            <div className="flex flex-col">
              <p className="text-right">안녕하세요</p>
              <p>{session.user.name}님</p>
            </div>
          ) : (
            <div>로그인 해주세요</div>
          )}
        </div>

        {/*최근노트*/}
        <div className="space-y-3 mt-12">
          <div className="flex justify-between">
            <h1>최근 노트</h1>
          </div>
          <div className="flex space-x-1.5 overflow-x-auto" id="scrollbar1">
            {recentPost &&
              recentPost.map((post) => {
                return (
                  <div
                    onClick={() => router.push(`/note/${post.uuid}`)}
                    className="bg-[#191919] w-36 p-3 px-4 text-sm rounded space-y-1 cursor-pointer flex-shrink-0"
                  >
                    <h2>{post.title}</h2>
                    <div
                      style={{ fontSize: '11px' }}
                      className="h-[145px] overflow-auto"
                    >
                      <LexicalComposer initialConfig={editorConfig}>
                        <RichTextPlugin
                          contentEditable={
                            <div className="editor-scroller">
                              <div className="editor">
                                <ContentEditable
                                  contentEditable={false}
                                  className="editor-content p-0"
                                />
                              </div>
                            </div>
                          }
                          ErrorBoundary={LexicalErrorBoundary}
                        />
                        <ContentPlugin content={post.content} />
                      </LexicalComposer>
                    </div>
                    <div
                      style={{ fontSize: '11px' }}
                      className="text-zinc-400"
                    >
                      {formatDateExcludeTime(post.updateDate)}
                    </div>
                  </div>
                );
              })}
            <div
              className="bg-[#191919] hover:bg-[#202020] cursor-pointer w-36 p-3 px-4 text-sm rounded overflow-hidden space-y-1 flex-shrink-0">
              <div
                onClick={() => postCreate()}
                className="flex flex-col space-y-2 pt-6 leading-4 h-[145px] overflow-hidden
                justify-center items-center"
              >
                <GrNotes className="text-2xl" />
                <div>새노트</div>
              </div>
            </div>
          </div>
        </div>

        {/*작업*/}
        <div className="mt-8 mb-8">
            <h1 className="">작업</h1>
            <div className="flex text-sm space-x-2 mt-5 border-zinc-700 border-b">
              <div className="border-b border-white pb-2 px-6 pl-1 cursor-pointer">
                노트
              </div>
            </div>

            <div className="flex text-sm my-2.5 pl-1">
              <div className="flex-1">제목</div>
              <div className="me-1">업데이트</div>
            </div>
            {posts &&
              posts.map((post) => {
                return (
                  <>
                    <div className="border-b border-zinc-700"></div>
                    <div
                      onClick={() => router.push(`/note/${post.uuid}`)}
                      className="flex text-sm py-2.5 hover:bg-[#141414] pl-1 cursor-pointer"
                    >
                      <div className="flex-1">{post.title}</div>
                      <div>{formatDate(post.updateDate)}</div>
                    </div>
                    <div className="border-b border-zinc-700"></div>
                  </>
                );
              })}
        </div>


      </div>

    </>
  );
};

export default Page;

