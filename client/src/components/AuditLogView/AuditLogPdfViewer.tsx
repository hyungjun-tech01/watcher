import React, { useEffect } from 'react';


interface IAuditLogPdfViewer {
    pdfUrl: string | undefined,
    onClose : (value:boolean) => void,
  };
const AuditLogPdfViewer = ({pdfUrl, onClose}: IAuditLogPdfViewer) => {
  useEffect(() => {
    const handleContextMenu = (e:any) => {
      e.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return (
    <div>
      <iframe
        title="pdfviewer"
        src={pdfUrl}
        style={{ width: '800px', height: '75vh', border: 'none' }}
      ></iframe>
    </div>
  );
};

export default AuditLogPdfViewer;