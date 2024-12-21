import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import React, { useEffect, useState } from 'react';
import api from '@/utils/api';
import { useModal } from '@/pages/components/modal/Modal';
import SnippetModal from '@/pages/components/modal/SnippetModal';
import { useFlashMessageContext } from '@/context/FleshMessageContext';
import { useMyStore } from '@/store/zustand/myStore';
import { CODE_LANGUAGE_LIST } from '@/editor/plugins/CodePlugin/CodeComponent';
import { createPortal } from 'react-dom';

const Code = () => {
  const [value, setValue] = useState('');
  let { data: codes } = api.code.getAll.useQuery(value);
  const [showId, setShowId] = useState(0);
  const [modal, showModal] = useModal();

  const openModal = (content: string) => {
    showModal('스니펫', (onClose) => <SnippetModal content={content} />);
  };


  return (
    <>
      {modal}
      <div className="flex flex-1 flex-col py-2.5 z-0 min-h-screen overflow-auto pb-12">
        <div className="flex justify-end ">
          <select
            onChange={(e) => setValue(e.target.value)}
            id="select"
            className="px-0 text-sm text-white bg-transparent border-0 outline-none mb-3 w-[150px]
                  dark:text-gray-400 dark:border-gray-300"
          >
            <option className="bg-[#141414] z-50" value={''}>
              언어를 선택해 주세요.
            </option>
            {CODE_LANGUAGE_LIST.map((code) => (
              <option className="bg-[#141414] z-50" value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-8">
          {codes &&
            codes.map((code) => {
              return (
                <div onMouseLeave={() => setShowId(0)} className="relative">
                  {code.id === showId && (
                    <div
                      onClick={() => openModal(code.content)}
                      className="absolute w-full h-full bg-black bg-opacity-50 justify-center flex items-center cursor-pointer"
                    >
                      {code.title}
                    </div>
                  )}
                  <SyntaxHighlighter
                    onMouseOver={() => setShowId(code.id)}
                    className="code-container bg-[#1a1a1a] cursor-pointer m-0"
                    language="javascript"
                    style={atomDark}
                  >
                    {code.content}
                  </SyntaxHighlighter>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Code;
