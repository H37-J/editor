import { createUID } from '@/utils/uid';

export type Comment = {
  author: string;
  content: string;
  deleted: boolean;
  id: string;
  timeStamp: number;
  type: 'comment';
}

export type Thread = {
  comments: Array<Comment>;
  id: string;
  quote: string
  type: 'thread';
}

export const createComment = (
  content: string,
  author: string,
  id?: string,
  timeStamp?: number,
  deleted?: boolean,
) : Comment=> {
  return {
    author,
    content,
    deleted: deleted === undefined ? false : deleted,
    id: id === undefined ? createUID() : id,
    timeStamp:
      timeStamp === undefined
        ? performance.timeOrigin + performance.now()
        : timeStamp,
    type: 'comment',
  };
}

export const createThread = (
  quote: string,
  comments: Array<Comment>,
  id?: string,
) : Thread => {
  return {
   comments,
    id: id === undefined? createUID() : id,
    quote,
    type: 'thread'
  };
}