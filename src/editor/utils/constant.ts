import { ElementFormatType } from 'lexical';

export const blockTypeToBlockName = {
  paragraph: '일반 텍스트',
  h1: '큰 헤더',
  h2: '중간 헤더',
  h3: '작은 헤더',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  check: '체크 리스트',
  bullet: '글먹리 목록',
  number: '번호 목록',
  code: '코드 블록',
  quote: '인용',
};

export const FONT_FAMILY_MAP: { [key: string]: string } = {
  'sans-serif': '산세리프',
  'Source Serif Pro,serif': '세리프',
  'Source Code Pro,monospace': '모노 세리프',
};

export const FONT_FAMILY_OPTIONS: [string, string][] = [
  ['sans-serif', '산세리프'],
  ['Source Serif Pro,serif', '세리프'],
  ['Source Code Pro,monospace', '모노 세리프'],
];

export const FONT_SIZE_OPTIONS: [string, string][] = [
  ['10px', '10px'],
  ['11px', '11px'],
  ['12px', '12px'],
  ['13px', '13px'],
  ['14px', '14px'],
  ['15px', '15px'],
  ['16px', '16px'],
  ['17px', '17px'],
  ['18px', '18px'],
  ['19px', '19px'],
  ['20px', '20px'],
];

export const ELEMENT_FORMAT_OPTIONS: {
  [key in Exclude<ElementFormatType, ''>]: {
    icon: string;
    iconRTL: string;
    name: string;
  };
} = {
  center: {
    icon: 'center-align',
    iconRTL: 'center-align',
    name: 'Center Align',
  },
  end: {
    icon: 'right-align',
    iconRTL: 'left-align',
    name: 'End Align',
  },
  justify: {
    icon: 'justify-align',
    iconRTL: 'justify-align',
    name: 'Justify Align',
  },
  left: {
    icon: 'left-align',
    iconRTL: 'left-align',
    name: 'Left Align',
  },
  right: {
    icon: 'right-align',
    iconRTL: 'right-align',
    name: 'Right Align',
  },
  start: {
    icon: 'left-align',
    iconRTL: 'right-align',
    name: 'Start Align',
  },
};