import Dialog from "./Dialog";

export default function ConfirmDialog({ title, children, confirmLabel, onConfirm, onClose }) {
  return <Dialog title={title} onClose={onClose}>
    <div>{children}</div>
    <div className="d-flex justify-content-end gap-2 mt-4"><button className="btn btn-outline-secondary" onClick={onClose} autoFocus>Volver</button><button className="btn btn-danger" onClick={onConfirm}>{confirmLabel}</button></div>
  </Dialog>;
}
