import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-[80vh] flex-1 flex-col items-center justify-center text-center">
      <p className="text-8xl font-bold text-indigo-600">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-slate-800">Page not found</h1>
      <p className="mt-2 text-sm text-slate-500">This panel page does not exist.</p>
      <button onClick={() => navigate("/")} className="mt-6 rounded-lg bg-indigo-600 px-6 py-3 text-sm text-white">
        Back to dashboard
      </button>
    </main>
  );
};

export default NotFound;
