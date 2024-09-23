const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
                <button onClick={onClose} className="absolute top-2 right-2">X</button>
                {children}
            </div>
        </div>
    );
};

Modal.Header = ({ children }) => <div className="text-xl font-bold mb-4">{children}</div>;
Modal.Body = ({ children }) => <div className="mb-4">{children}</div>;
Modal.Footer = ({ children }) => <div className="flex justify-end space-x-2">{children}</div>;

export default Modal;
