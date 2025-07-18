export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Access Denied
        </h2>
        <p className="mt-2 text-gray-600">
          You do not have permission to access this page.
        </p>
      </div>
    </div>
  );
} 