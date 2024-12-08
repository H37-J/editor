import NavBar from '@/pages/components/NavBar';

const Layout = ({ children }) => {
  return (
    <>
      <div
        className="bg-dark-1 h-screen py-1.5 px-1.5 ml-16 md:ml-64 space-x-1.5"
        suppressHydrationWarning={true}
      >
        <NavBar />
        <div className="flex flex-col flex-1 h-full">
          {children}
        </div>
      </div>
    </>
  );
}

export default Layout;