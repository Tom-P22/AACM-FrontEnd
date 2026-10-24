import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

export default function Dialog({ title, onClose, children, className = "" }) {
  const ref = useRef(null); const titleId = useId();
  useEffect(() => {
    const node = ref.current;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    node.showModal();
    return () => { node.close(); document.body.style.overflow = previous; };
  }, []);
  return createPortal(<dialog ref={ref} className={`app-dialog ${className}`} aria-labelledby={titleId}
    onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="p-4">
      <div className="d-flex align-items-center justify-content-between gap-3 border-bottom pb-3 mb-3 no-print"><h2 id={titleId} className="h5 fw-bold mb-0">{title}</h2><button type="button" className="btn-close" aria-label="Cerrar ventana" onClick={onClose}></button></div>
      {children}
    </div>
  </dialog>, document.body);
}
