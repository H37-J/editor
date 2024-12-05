import type { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';


const fetchPosts = async () => {
  return [
    { id: '1', title: '첫 번째 포스트' },
    { id: '2', title: '두 번째 포스트' },
  ];
};

export const getStaticPaths: GetStaticPaths = async (context) => {
  const posts = await fetchPosts();

  const paths = posts.map((post) => ({
    params: { id: post.id },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const posts = await fetchPosts();
  const post = posts.find((p) => p.id === params?.id);

  return {
    props: {
      post,
    },
  };
};

const Post = ({ post }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>포스트 내용...</p>
    </div>
  );
};

export default Post;