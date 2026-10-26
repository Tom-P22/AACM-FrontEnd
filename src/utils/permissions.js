const permissions = {
  admin: ["admin:access", "products:write", "news:write", "users:read", "reservations:manage", "messages:read", "messages:manage"],
  editor: ["admin:access", "news:write"],
  user: [],
};

export function hasPermission(user, permission) {
  return typeof user?.role === "string" && Object.hasOwn(permissions, user.role) && permissions[user.role].includes(permission);
}

export function roleLabel(role) {
  const labels = { admin: "Administrador", editor: "Editor de noticias", user: "Usuario" };
  return typeof role === "string" && Object.hasOwn(labels, role) ? labels[role] : "Usuario";
}
