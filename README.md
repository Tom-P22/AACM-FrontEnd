# Deportes San Miguel

Frontend de Administración y Arriendo de Canchas Municipales, desarrollado con React, React Router y Bootstrap. Permite consultar canchas e implementos, realizar reservas y gestionar productos, noticias y consultas según el rol del usuario.

## Requisitos

- Node.js 20.19+ o 22.12+; probado con Node.js 24.
- npm.

## Instalar y ejecutar

```sh
npm ci
npm run demo
```

Abrir http://127.0.0.1:5174. Para desarrollo también está disponible `npm run dev`.

Los datos se conservan en el navegador. Utilizar siempre la misma dirección y puerto para acceder a los mismos registros.

## Cuentas disponibles

| Rol | Correo | Contraseña |
| --- | --- | --- |
| Administrador | admin@admin.com | Admin123 |
| Editor de noticias | editor@duoc.cl | Editor123 |
| Vecino | vecino@gmail.com | Vecino123 |

## Verificar y compilar

```sh
npm run verify
```

Ejecuta el análisis de código, las 10 pruebas unitarias de componentes con Vitest y la compilación de producción. Las pruebas usan jsdom y no requieren un navegador instalado.

```sh
npm test
npm run test:unit
npm run test:components
npm run test:watch
npm run test:coverage
npm run build
npm run preview
```

`npm run test:coverage` genera cobertura V8 en `coverage/`, con informes HTML, LCOV y JSON. `npm run test:watch` vuelve a ejecutar las pruebas al editar archivos.
