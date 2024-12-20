import Link from 'next/link';

const SideMenu = ({ Icon, content, link, className, onClick }: {Icon: any, content: string, link: string, className: string, onClick?: () => void}) => {
  return (
    <Link
      onClick={onClick}
      href={link}
      className={`flex flex-1 md:justify-start justify-center items-center py-3 md:py-2.5 md:px-4 hover:bg-neutral-750 md:text-sm ${className}`}
    >
      <Icon className="w-16 h-6 md:w-8 md:h-4" />
      <span style={{fontSize: '13px'}} className="ml-1 hidden sm:block font-light">{content}</span>
    </Link>
  );
};
export default SideMenu;
