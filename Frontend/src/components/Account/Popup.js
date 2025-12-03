const Popup = ({ closePopup, children }) => {
      return (
        <div onClick={closePopup} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="flex flex-col bg-white p-6 rounded-lg shadow-lg relative">
            {children}
            <button className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" onClick={closePopup}>Close</button>
          </div>
        </div>
      );
    };
    export default Popup;