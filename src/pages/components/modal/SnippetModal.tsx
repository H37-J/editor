import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import React from 'react';
import { useFlashMessageContext } from '@/context/FleshMessageContext';


const SnippetModal = ({content}: {content: string}) => {
  const showFlashMessage = useFlashMessageContext();
  const copy = async (content: string) => {
    await navigator.clipboard.writeText(content);
    showFlashMessage('클립보드에 복사 되었습니다.', 2000);
  };

  return (
      <div className="flex flex-col flex-1 fixed top-0 right-0 left-0 bottom-0 m-12 overflow-auto">
        <SyntaxHighlighter
          className='bg-[#1a1a1a] hover:bg-[#171717] h-full'
          language="javascript" style={atomDark}>
          {content}
        </SyntaxHighlighter>
        <button onClick={() => copy(content)} className="absolute right-6 bottom-6 p-3 px-12 bg-indigo-500 text-white rounded ">복사</button>
      </div>
  )
}

export default SnippetModal