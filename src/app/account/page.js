
export default function accountPage() {
  return (
    <div>
      <h1 className="text-4xl font-semibold">Account Overview</h1>

      <form className="lg:grid lg:grid-cols-2">
        <div className="mt-6 flex flex-col gap-2 lg:mr-32">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
            <input type="text" name="firstName" id="firstName" className="mt-1 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:ring-opacity-40 mb-2 transition-all w-full rounded-md shadow h-7 p-4" />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
            <input type="text" name="lastName" id="lastName" className="mt-1 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:ring-opacity-40 mb-2 transition-all w-full rounded-md shadow h-7 p-4" />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" id="email" autoComplete="email" className="mt-1 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:ring-opacity-40 mb-2 transition-all w-full rounded-md shadow h-7 p-4" />
          </div>
          <div >
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input type="tel" name="phoneNumber" id="phoneNumber" autoComplete="tel" className="mt-1 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:ring-opacity-40 mb-2 transition-all w-full rounded-md shadow h-7 p-4" />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
            <input type="password" name="currentPassword" id="currentPassword" autoComplete="current-password" className="mt-1 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:ring-opacity-40 mb-2 transition-all w-full rounded-md shadow h-7 p-4" />
          </div>
          <div >
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
            <input type="password" name="newPassword" id="newPassword" autoComplete="new-password" className="mt-1 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:ring-opacity-40 mb-2 transition-all w-full rounded-md shadow h-7 p-4" />
          </div>
          <div >
            <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input type="password" name="confirmNewPassword" id="confirmNewPassword" autoComplete="new-password" className="mt-1 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:ring-opacity-40 mb-2 transition-all w-full rounded-md shadow h-7 p-4" />
          </div>
        </div>

        <div className="mt-6 w-full lg:w-auto text-center lg:text-left">
          <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow hover:shadow-md font-semibold text-white bg-indigo-500 hover:bg-indigo-700 w-2/3 text-center">
            Submit
          </button>
        </div>
      </form>

    </div>
  );
}
