import React, { useEffect, useState } from 'react';
import { CODE_LANGUAGE_LIST } from '@/editor/plugins/CodePlugin/CodeComponent';
import { useCode } from '@/hooks/useCode';
import { useFlashMessageContext } from '@/context/FleshMessageContext';

const CodeModal = ({content, onClose} : {content: string, onClose: () => void}) => {
  const [title, setTitle] = useState('');
  const [lang, setLang] = useState('C');
  const codeUtils = useCode();
  const showFlashMessage = useFlashMessageContext();
  const save = async () => {
    await codeUtils.createCode({
      title: title,
      lang: lang,
      content: content,
    })
    showFlashMessage('내 스니펫에 저장 되었습니다.')
    onClose();
  }

  return (
    <div className="flex flex-1 justify-center items-center">
      <div className="w-[350px] px-8 pt-10 pb-10  bg-[#141414] space-y-6">
        <input
          onChange={(e) => setTitle(e.target.value) }
          type="text"
          placeholder="제목을 입력 해주세요"
          className="py-2.5 px-0 text-white text-sm border-gray-300 outline-none peer border-b bg-transparent w-full"
        />
        <div>
          <select
            onChange={(e) => setLang(e.target.value)}
            className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b outline-none
                  dark:text-gray-400 dark:border-gray-300"
          >
            {CODE_LANGUAGE_LIST.map((code) => (
              <option className="bg-[#141414] z-50" value={code}>{code}</option>
            ))}
          </select>
        </div>
        <div>
          <button onClick={() => save()} className="p-4 px-12 rounded-md bg-cyan-500 hover:bg-rose-600 w-full">
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeModal;
