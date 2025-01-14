import React, { useEffect, useState, useRef } from "react";
import "../../../style/settings-popup.css";

const SettingsPopup = ({ title, placeholder, defaultValue, type, onSave, onClose }) => {
  const [value, setValue] = useState(defaultValue || "");
  const modalRef = useRef(null);

  // Prevent background scrolling
  useEffect(() => {
    document.body.style.overflow = "hidden"; // Disable background scrolling
    return () => {
      document.body.style.overflow = "auto"; // Restore scrolling on unmount
    };
  }, []);

  // Close modal on clicking outside
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleSave = () => {
    if (!value.trim()) {
      alert("Value cannot be empty!");
      return;
    }
    onSave(value);
    onClose();
  };

  return (
    <div className="settings-popup-overlay">
      <div className="settings-popup-container" ref={modalRef}>
        <h2>{title}</h2>
        <input
          type={type || "text"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="settings-input"
        />
        <div className="settings-popup-buttons">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPopup;
