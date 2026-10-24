import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useContent } from "../context/ContentContext";
import { useReservations } from "../context/ReservationContext";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ReservationList from "../components/ReservationList";
import ContentManager from "../components/admin/ContentManager";
import StatCard from "../components/ui/StatCard";
import Avatar from "../components/Avatar";
import { roleLabel } from "../utils/permissions.js";

export default function Admin() {
  const { users, user, isAuthenticated, canAccessAdmin, can } = useAuth();
  const { products, news } = useContent();
  const { reservations, messages, cancelReservation } = useReservations();
  const [tab, setTab] = useState("dashboard");
  const [notice, setNotice] = useState(null);

  if (!isAuthenticated || !canAccessAdmin) return <div className="min-vh-100 bg-light"><Header /><main className="container py-5 text-center">
    <h1 className="h3">{isAuthenticated ? "Acceso restringido" : "Debes iniciar sesión para acceder al panel"}</h1>
    <p className="text-muted">{isAuthenticated ? "Tu cuenta no tiene permisos de administración." : "Ingresa con una cuenta autorizada para continuar."}</p>
    <Link to={isAuthenticated ? "/" : "/login"} className="btn btn-primary">{isAuthenticated ? "Volver al inicio" : "Ir a Login"}</Link>
  </main></div>;

  const tabs = [
    { id: "dashboard", label: "Resumen", icon: "fa-chart-line" },
    { id: "productos", label: "Productos y canchas", icon: "fa-boxes-stacked", permission: "products:write" },
    { id: "noticias", label: "Noticias", icon: "fa-newspaper", permission: "news:write" },
    { id: "usuarios", label: "Usuarios", icon: "fa-users", permission: "users:read" },
    { id: "ordenes", label: "Reservas", icon: "fa-calendar-check", permission: "reservations:manage" },
    { id: "consultas", label: "Consultas", icon: "fa-envelope", permission: "messages:read" },
  ].filter((item) => !item.permission || can(item.permission));
  const activeTab = tabs.some((item) => item.id === tab) ? tab : "dashboard";
  const handleCancel = (id) => {
    const result = cancelReservation(id);
    setNotice({ success: result.success, message: result.success ? "Reserva cancelada." : result.message });
  };

  return <div className="min-vh-100 bg-light d-flex flex-column">
    <Header />
    <main className="container py-4 py-lg-5 flex-grow-1 admin-shell">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div><p className="text-primary small fw-bold text-uppercase mb-1">Deportes San Miguel</p><h1 className="h3 fw-bold mb-1">Panel de administración</h1><p className="text-muted mb-0">Gestiona los recintos, las noticias y la comunidad.</p></div>
        <div className="d-flex align-items-center gap-3"><Avatar src={user.avatar} name={user.nombre} /><div><div className="fw-semibold">{user.nombre} {user.apellidos}</div><span className="badge bg-primary-subtle text-primary">{roleLabel(user.role)}</span></div></div>
      </div>
      <nav className="admin-tabs card border-0 shadow-sm mb-4 p-2" aria-label="Secciones de administración">
        <div className="nav nav-pills gap-1 flex-nowrap overflow-auto">{tabs.map((item) => <button key={item.id} type="button"
          className={`nav-link text-nowrap ${activeTab === item.id ? "active" : "text-body-secondary"}`} aria-current={activeTab === item.id ? "page" : undefined}
          onClick={() => { setTab(item.id); setNotice(null); }}><i className={`fa-solid ${item.icon} me-2`}></i>{item.label}</button>)}</div>
      </nav>
      {notice && <p className={`alert ${notice.success ? "alert-success" : "alert-danger"}`} role="alert">{notice.message}</p>}
      {activeTab === "dashboard" && <>
        <h2 className="h4 fw-bold mb-4">Resumen general</h2>
        <div className="row g-3 mb-4">
          <div className="col-sm-6 col-xl-3"><StatCard icon="fa-volleyball" color="primary" number={products.filter((item) => item.active !== false).length} label="Productos publicados" /></div>
          <div className="col-sm-6 col-xl-3"><StatCard icon="fa-newspaper" color="info" number={news.filter((item) => item.active !== false).length} label="Noticias publicadas" /></div>
          {can("users:read") && <div className="col-sm-6 col-xl-3"><StatCard icon="fa-users" color="success" number={users.length} label="Usuarios registrados" /></div>}
          {can("reservations:manage") && <div className="col-sm-6 col-xl-3"><StatCard icon="fa-calendar-check" color="warning" number={reservations.filter((item) => item.status === "confirmada").length} label="Reservas confirmadas" /></div>}
        </div>
        <div className="card border-0 shadow-sm p-4"><h3 className="h5 fw-bold">Tu espacio de gestión</h3><p className="text-muted mb-3">Selecciona una sección para administrar el contenido al que tu cuenta tiene acceso.</p>
          <div className="d-flex flex-wrap gap-2">{tabs.filter((item) => item.id !== "dashboard").map((item) => <button key={item.id} className="btn btn-outline-primary" onClick={() => setTab(item.id)}>{item.label}</button>)}</div>
        </div>
      </>}
      {activeTab === "productos" && can("products:write") && <ContentManager key="products" type="products" />}
      {activeTab === "noticias" && can("news:write") && <ContentManager key="news" type="news" />}
      {activeTab === "usuarios" && can("users:read") && <>
        <h2 className="h4 fw-bold mb-4">Usuarios registrados</h2>
        <div className="card border-0 shadow-sm overflow-hidden"><div className="table-responsive"><table className="table align-middle mb-0 admin-table">
          <thead className="table-light"><tr><th scope="col">Usuario</th><th scope="col">RUT</th><th scope="col">Correo</th><th scope="col">Comuna</th><th scope="col">Permisos</th></tr></thead>
          <tbody>{users.map((account) => <tr key={account.id}><td><div className="d-flex gap-2 align-items-center"><Avatar src={account.avatar} name={account.nombre} size={36} /><span>{account.nombre} {account.apellidos}</span></div></td><td>{account.run}</td><td>{account.correo}</td><td>{account.comuna}</td><td><span className="badge bg-primary-subtle text-primary">{roleLabel(account.role)}</span></td></tr>)}</tbody>
        </table></div></div>
      </>}
      {activeTab === "ordenes" && can("reservations:manage") && <><h2 className="h4 fw-bold mb-4">Reservas</h2><ReservationList reservations={reservations} onCancel={handleCancel} showCustomer /></>}
      {activeTab === "consultas" && can("messages:read") && <>
        <h2 className="h4 fw-bold mb-4">Consultas recibidas</h2>
        {messages.length === 0 ? <p className="text-muted">Aún no hay consultas.</p> : [...messages].reverse().map((message) => <article key={message.id} className="card border-0 shadow-sm mb-3 p-4"><h3 className="h6 fw-bold">{message.nombre}</h3><p className="small text-muted">{message.correo} · {new Date(message.createdAt).toLocaleString("es-CL")}</p><p className="mb-0" style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{message.comentario}</p></article>)}
      </>}
    </main>
    <Footer />
  </div>;
}
