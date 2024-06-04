import React, { useState } from 'react';
import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

interface IAuditLogPdfViewer {
    pdfUrl: string | undefined,
    onClose : (value:boolean) => void,
  };
const AuditLogPdfViewer = ({pdfUrl, onClose}: IAuditLogPdfViewer) => {
  const [numPages, setNumPages] = useState<number|null>(null);

  const onDocumentLoadSuccess = (pdf: PDFDocumentProxy) => {
    setNumPages(pdf.numPages);
  };

  console.log(pdfUrl);
  return(
    <div style={{ height: '75vh', overflow: 'auto' }}>
    <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        renderMode="canvas"
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} />
        ))}
      </Document>
  </div>
  )
  // useEffect(() => {
  //   const handleContextMenu = (e:any) => {
  //     e.preventDefault();
  //   };

  //   document.addEventListener('contextmenu', handleContextMenu);

  //   // Cleanup the event listener on component unmount
  //   return () => {
  //     document.removeEventListener('contextmenu', handleContextMenu);
  //   };
  // }, []);

  // return (
  //   <div>
  //     <iframe
  //       title="pdfviewer"
  //       src={pdfUrl}
  //       style={{ width: '800px', height: '75vh', border: 'none' }}
  //     ></iframe>
  //   </div>
  // );
};

export default AuditLogPdfViewer;