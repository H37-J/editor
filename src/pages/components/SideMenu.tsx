import Link from 'next/link';

const SideMenu = ({ Icon, content, link }) => {
  return (
    <Link
      href={link}
      className="flex items-center py-4 sm:py-2.5 px-4 hover:bg-neutral-750 text-sm"
    >
      <Icon className="w-16 sm:w-8" />
      <span className="ml-1 hidden sm:block">{content}</span>
    </Link>
  );
};
export default SideMenu;
