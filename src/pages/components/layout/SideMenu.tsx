import Link from 'next/link';

const SideMenu = ({ Icon, content, link }) => {
  return (
    <Link
      href={link}
      className="flex items-center py-3 sm:py-2.5 px-4 hover:bg-neutral-750 text-sm"
    >
      <Icon className="w-16 sm:w-8" />
      <span style={{fontSize: '13px'}} className="ml-1 hidden sm:block font-light">{content}</span>
    </Link>
  );
};
export default SideMenu;
