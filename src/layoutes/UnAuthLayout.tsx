const UnAuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <header className="bg-blue-500 text-white p-4">My App</header>
      <p>unauthenticated user</p>

      <main className="p-6">{children}</main>
      <footer className="bg-gray-200 p-4 text-center">© 2025 MyApp</footer>
    </div>
  );
};

export default UnAuthLayout;
