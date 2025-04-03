const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <p>authenticated user</p>
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-md">{children}</div>
    </div>
  );
};

export default AuthLayout;
