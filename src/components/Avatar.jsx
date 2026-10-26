import { DEFAULT_AVATAR } from "../utils/avatar.js";

export default function Avatar({ src, name = "Usuario", size = 48 }) {
  return <img src={src || DEFAULT_AVATAR} alt={`Foto de perfil de ${name}`} className="profile-avatar"
    style={{ width: size, height: size }} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = DEFAULT_AVATAR; }} />;
}
