import ReactDOM from "react-dom";
import '../css/creatorDetails.css'
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}

export default Modal;