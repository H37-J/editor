import React, { useState } from 'react';
import Gallery from '../components/gallery/Gallery';
import Code from '@/pages/components/code/Code';
import api from '@/utils/api';
import { formatDate } from '@/utils/date';
import { useRouter } from 'next/router';


const Page = () => {
  const arr = [
    {
      id: 1,
      title: '노트',
      selected: true,
    },
    {
      id: 2,
      title: '코드',
      selected: false,
    },
    {
      id: 3,
      title: '갤러리',
      selected: false,
    },
  ];

  const [items, setItems] = useState(arr);
  const [selectedId, setSelectedId] = useState(1);
  const  {data: posts} = api.post.getAll.useQuery(undefined);
  const router = useRouter();

  const change = (id: number) => {
    items.map((item) => {
      item.id === id ? (item.selected = true) : (item.selected = false);
      setItems([...items]);
    });
    setSelectedId(id);
  };


  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="flex-1 h-screen p-6 bg-gradient-to-r from-[#222126] from-5% via-[#29282a] via-50% to-[#2b292d] to-100%">
        <h1 className="">작업</h1>
        <div id="container" className="flex justify-between border-zinc-700 border-b items-center">
          <div className="flex flex-1 text-sm space-x-2 mt-5">
            {items.map((item) => {
              return (
                <div
                  key={item.id}
                  onClick={() => change(item.id)}
                  className={`border-b pb-2 px-6 pl-1 cursor-pointer ${item.selected ? 'border-white' : 'border-transparent'}`}
                >
                  {item.title}
                </div>
              );
            })}
          </div>
        </div>
        {selectedId === 1 ? (
          <>
            <div className="flex text-sm my-2.5 pl-1">
              <div className="flex-1">제목</div>
              <div className="me-4">업데이트</div>
            </div>
            {posts &&
              posts.length > 0 &&
              posts.map((post) => {
                return (
                  <>
                    <div className="border-b border-zinc-700"></div>
                    <div
                      onClick={() => router.push(`/note/${post.uuid}`)}
                      className="flex text-sm py-2.5 pl-1 hover:bg-zinc-800 cursor-pointer"
                    >
                      <div className="flex-1">{post.title}</div>
                      <div className="me-4">{formatDate(post.updateDate)}</div>
                    </div>
                    <div className="border-b border-zinc-700"></div>
                  </>
                );
              })}
          </>
        ) : selectedId === 2 ? (
         <Code />
        ) : (
          <div className="py-4">
            <Gallery />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
