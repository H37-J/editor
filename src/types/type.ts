export type UserType = {
  id: number;
  name: string;
  email: string;
  post?: PostType[];
}

export type PostType = {
  id: number;
  title: string;
  content: string;
  published: Date | number;
  user: UserType;
  user_id: number;
  image: string;
  category: CategoryType;
  category_id: number;
}

export type CategoryType = {
  id: number;
  name: string;
  descript: string;
  post: PostType[];
}