export default function StatCard({ icon, color, number, label }) {
  return (
    <div className={`card shadow-sm p-3 border-start border-4 border-${color}`}>
      <div className="d-flex align-items-center">
        <i className={`fa-solid ${icon} fs-1 text-${color} me-3`}></i>
        <div>
          <h3 className="h2 fw-bold m-0">{number}</h3>
          <p className="text-muted m-0 small">{label}</p>
        </div>
      </div>
    </div>
  );
}
