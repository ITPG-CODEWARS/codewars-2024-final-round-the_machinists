import React, { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

type BuyTicketModalProps = {
  isOpen: boolean;
  onClose: () => void;
  trainName: string;
  trainDesc: string;
  finalURL: string; // The URL with the use endpoint
};

const BuyTicketModal: React.FC<BuyTicketModalProps> = ({
  isOpen,
  onClose,
  trainName,
  trainDesc,
  finalURL,
}) => {
  const qrCodeRef = useRef(null);

  const copyUrl = () => {
    navigator.clipboard.writeText(finalURL);
    alert("Copied to Clipboard!");
  };

  const downloadQRCode = () => {
    const qrCodeURL = qrCodeRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = qrCodeURL;
    a.download = "qrcode.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/3">
        <h2 className="text-xl font-bold mb-4">
          Ticket for {trainName} Purchased!
        </h2>
        <p className="mb-4">
          <b>{trainDesc}</b>
        </p>
        <p className="mb-4">
          <b>Your ticket URL:</b> <br />
          {finalURL}
        </p>
        <QRCodeCanvas value={finalURL} size={128} ref={qrCodeRef} />
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-lg"
            onClick={downloadQRCode}
          >
            Download QR Code
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            onClick={copyUrl}
          >
            Copy URL
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyTicketModal;
