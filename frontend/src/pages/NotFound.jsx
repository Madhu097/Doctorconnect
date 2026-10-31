import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-8xl font-bold text-primary">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-gray-800">Page not found</h1>
      <p className="mt-2 text-sm text-gray-500">The page you requested does not exist.</p>
      <button onClick={() => navigate("/")} className="mt-6 rounded-full bg-primary px-6 py-3 text-sm text-white">
        Back to home
      </button>
    </main>
  );
};

export default NotFound;
