
import React from 'react';
import styles from './Modal.module.css';
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) {
    return null; // Don't render anything if the modal is closed
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {children}
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default Modal;