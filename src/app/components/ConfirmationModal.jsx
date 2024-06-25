'use client'

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p className="mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button 
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="bg-red-500 px-4 py-2 text-white rounded hover:bg-red-700" 
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
