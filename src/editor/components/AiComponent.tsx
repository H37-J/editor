import { LexicalEditor } from 'lexical';
import { AiModal, CodingAiModal, useModal } from '@/pages/components/modal/Modal';
import DropDown, { DropDownItem } from '@/pages/components/dropdown/DropDown';
import { post } from '@/utils/api-utils';
import { AiModel, useAiStore } from '@/store/zustand/aiStore';
import { useEditorStore } from '@/store/zustand/editorStore';
import React from 'react';
import { useFlashMessageContext } from '@/context/FleshMessageContext';
import {
  BULLET_SYSTEM,
  DESCRIPTION_SYSTEM,
  EMAIL_SYSTEM, KEYWORD_SYSTEM, LANGUAGE_LIST,
  RESULT_SYSTEM,
  SUBJECT_SYSTEM,
  TWEET_SYSTEM,
} from '@/utils/constant';

const AiComponent = ({ editor }: { editor: LexicalEditor }) => {
  const [modal, showModal] = useModal();
  const showFlashMessage = useFlashMessageContext();

  const correctAi = async () => {
    if (useEditorStore.getState().selectedContent === '') {
      showFlashMessage('텍스트를 선택해 주세요', 1000)
      return false;
    }

    showModal('오타 수정', (onClose) => {
      return <AiModal title="오타 수정" onClose={onClose} />;
    });

    const data = await post<AiModel>('/api/correct', {
      prompt: useEditorStore.getState().selectedContent,
    });
    useAiStore.getState().setResult(data);
    useAiStore.getState().setLoading(false);
  };

  const articleAi = async (system: string) => {
    if (useEditorStore.getState().selectedContent === '') {
      showFlashMessage('텍스트를 선택해 주세요', 1000)
      return false;
    }

    showModal('요약', (onClose) => {
      return <AiModal title="요약" onClose={onClose} />;
    });

    const data = await post<AiModel>('/api/article', {
      prompt: useEditorStore.getState().selectedContent,
      system,
    });
    useAiStore.getState().setResult(data);
    useAiStore.getState().setLoading(false);
  }

  const translateAi = async (language: string) => {
    if (useEditorStore.getState().selectedContent === '') {
      showFlashMessage('텍스트를 선택해 주세요', 1000)
      return false;
    }

    showModal('번역', (onClose) => {
      return <AiModal title="번역" onClose={onClose} />;
    });

    const data = await post<AiModel>('/api/translate', {
      prompt: useEditorStore.getState().selectedContent,
      language,
    });
    useAiStore.getState().setResult(data);
    useAiStore.getState().setLoading(false);
  }

  const codeAi = () => {
    useAiStore.getState().resetState();
    showModal('코딩 도우미', (onClose) => {
      return <CodingAiModal title="코딩 도우미" onClose={onClose} />;
    });

  }

  return (
    <>
      <DropDown
        title="AI 기능"
        buttonClassName="toolbar-item space-x-1.5"
        text="AI 기능"
        buttonIconClassNamePrefix="mt-1 format ai"
        buttonIconClassNamePost="format down"
      >
        <DropDown
          title="글 쓰기 도우미"
          buttonClassName="toolbar-item rounded-[0px] space-x-1.5 py-2.5 px-3"
          text="글 쓰기 도우미"
          direction="right"
        >
          <DropDownItem className="text-sm" onClick={() => articleAi(KEYWORD_SYSTEM)}>
             글 작성
          </DropDownItem>
          <DropDownItem className="text-sm" onClick={() => articleAi(SUBJECT_SYSTEM)}>
            글 제목 짓기
          </DropDownItem>
          <DropDownItem className="text-sm" onClick={() => articleAi(RESULT_SYSTEM)}>
            결론
          </DropDownItem>
        </DropDown>
        <DropDown
          title="요약"
          buttonClassName="toolbar-item rounded-[0px] space-x-1.5 py-2.5 px-3"
          text="요약"
          direction="right"
        >
          <DropDownItem className="text-sm" onClick={() => articleAi(DESCRIPTION_SYSTEM)}>
            주제
          </DropDownItem>
          <DropDownItem className="text-sm" onClick={() => articleAi(BULLET_SYSTEM)}>
            글머리 기호
          </DropDownItem>
          <DropDownItem className="text-sm" onClick={() => articleAi(EMAIL_SYSTEM)}>
            이메일
          </DropDownItem>
          <DropDownItem className="text-sm" onClick={() => articleAi(TWEET_SYSTEM)}>
            트위터
          </DropDownItem>
        </DropDown>
        <DropDown
          title="번역"
          buttonClassName="toolbar-item round ed-[0px] space-x-1.5 py-2.5 px-3"
          text="번역"
          direction="right"
        >
          {LANGUAGE_LIST.map((language) => {
            return (
              <DropDownItem key={language} className="text-sm" onClick={() => translateAi(language)}>
                {language}
              </DropDownItem>
            )
          })}
        </DropDown>
        <DropDownItem className="text-sm" onClick={() => codeAi()}>
          <span className="pt-0.5">코딩 도우미</span>
        </DropDownItem>
        <DropDownItem className="text-sm" onClick={() => correctAi()}>
          <span className="pt-0.5">오타 수정</span>
        </DropDownItem>
      </DropDown>
      {modal}
    </>
  );
};

export default AiComponent;
