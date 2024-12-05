import { useForm } from 'react-hook-form';

import { useUser } from '@/store/context';
import { UserType } from '@/types/type';

interface UserFormValues {
  name: string;
}

const Page = () => {
  // @ts-ignore
  const { user, setUser } = useUser();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<UserFormValues>();
  const onSubmit = handleSubmit(({ name }) => {
    setUser({ name });
  });

  return (
    <>
      {user ? (
        <span> {user}</span>
      ) : (
        <form onSubmit={onSubmit}>
          <button type="submit">Submit</button>
        </form>
      )}
    </>
  );
};

export default Page;
