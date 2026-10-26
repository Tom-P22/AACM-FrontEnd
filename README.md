# Deportes San Miguel

Frontend de Administración y Arriendo de Canchas Municipales, desarrollado con React, React Router y Bootstrap. Permite consultar canchas e implementos, realizar reservas y gestionar productos, noticias y consultas según el rol del usuario.

## Requisitos

- Node.js 22.22.2+ (rama 22), 24.15+ (rama 24) o 26+; probado con Node.js 24.22.
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

Ejecuta el análisis de código, las 101 pruebas con Vitest y la compilación de producción:

- 91 pruebas de servicios y reglas en entorno Node: usuarios, validaciones, permisos, contenido, carrito, stock, reservas, consultas y comprobantes.
- 10 pruebas de componentes con React Testing Library y jsdom: renderizado, propiedades, estado, eventos y permisos.

Ambos grupos se configuran en `vitest.config.js`. Las pruebas de servicios conservan sus aserciones originales de `node:assert/strict`, pero se registran y ejecutan con Vitest. No requieren navegador instalado ni conectarse al backend; los datos de prueba se guardan en memoria.

```sh
npm test
npm run test:unit
npm run test:services
npm run test:components
npm run test:watch
npm run test:coverage
npm run build
npm run preview
```

`npm test` y `npm run test:unit` ejecutan los 101 casos. `npm run test:services` ejecuta solo los 91 de servicios y `npm run test:components` los diez de componentes.

`npm run test:coverage` mide ambos grupos con V8 y genera informes HTML, LCOV y JSON en `coverage/`. La cobertura es parcial y no certifica toda la aplicación. `npm run test:watch` vuelve a ejecutar las pruebas al editar archivos.
