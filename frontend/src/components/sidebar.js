function Sidebar({ toggleTable }) {

  const locationChange = () => {
      localStorage.clear();
      window.location.replace("/");
  }

  return (
      <div className="bg-gray-800 text-white h-full min-h-screen w-64 p-4">
          <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
          <ul>
              <li className="mb-4">
                  <button
                      onClick={toggleTable}
                      className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-700"
                  >
                      Toggle Data
                  </button>
              </li>
              <li className="mb-4">
                  <a href={locationChange} className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-700">
                      Logout
                  </a>
              </li>
          </ul>
      </div>
  );
}

export default Sidebar;