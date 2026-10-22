# PayFlow — Dashboard de transacciones

🌐 **Español** | [English](README.en.md)

[![CI](https://github.com/DiegoZM1006/payflow/actions/workflows/ci.yml/badge.svg)](https://github.com/DiegoZM1006/payflow/actions/workflows/ci.yml)

Aplicación full stack (Django + React) que carga el dataset de transacciones de PayFlow, lo expone mediante una API REST paginada y lo presenta en una landing page, un dashboard y un explorador de transacciones para el equipo comercial.

**Demo en vivo**

| | URL |
| --- | --- |
| Aplicación | https://payflow-wine-five.vercel.app |
| Documentación de la API (Swagger) | https://payflow-api-mm5l.onrender.com/api/docs/ |

> La API corre en el plan gratuito de Render: después de 15 minutos sin tráfico se suspende, y la primera petición tarda ~50 s en despertarla.

## Contenido

1. [Stack tecnológico](#stack-tecnológico)
2. [Cómo levantar el proyecto en local](#cómo-levantar-el-proyecto-en-local)
3. [Despliegue](#despliegue)
4. [API](#api)
5. [Decisiones técnicas](#decisiones-técnicas)
6. [Paginación server-side vs client-side](#paginación-server-side-vs-client-side)
7. [Supuestos](#supuestos)
8. [Pendientes y mejoras](#pendientes-y-mejoras)
9. [Capturas de pantalla](#capturas-de-pantalla)

## Stack tecnológico

| Capa | Tecnologías |
| --- | --- |
| Backend | Python 3.13, Django 5.2 LTS, Django REST Framework, django-filter, drf-spectacular, django-environ, django-cors-headers |
| Frontend | React 19, TypeScript, Vite, React Router 7, TanStack Query 5, axios, Recharts, Tailwind CSS 4, lucide-react |
| Base de datos | SQLite en desarrollo local, PostgreSQL en Docker (17) y en producción |
| Calidad | Tests de Django (19), Vitest + Testing Library (10), Ruff, ESLint, Prettier, GitHub Actions |
| Infraestructura | Docker, Docker Compose, gunicorn, whitenoise, nginx, Render (API + PostgreSQL), Vercel (frontend) |

### Checklist de requisitos

Están implementados todos los requisitos obligatorios y todos los bonus:

- [x] Docker Compose (base de datos, backend y frontend con un solo comando)
- [x] TypeScript
- [x] Tests del frontend para el componente de paginación (Vitest + Testing Library)
- [x] Documentación de la API con OpenAPI y Swagger UI (drf-spectacular)
- [x] Caché de peticiones en el frontend (TanStack Query)
- [x] Exportación a CSV de las transacciones filtradas
- [x] Modo oscuro **y** despliegue público

Extras: CI en cada push y pull request, linters y formateadores (Ruff, ESLint, Prettier), GitHub Flow con la rama `main` protegida, code splitting y componentes accesibles.

## Cómo levantar el proyecto en local

```
payflow/
├── backend/              # Proyecto Django (config/) y la app transactions
├── frontend/             # SPA en React
├── data/transactions.csv # Dataset
├── docker-compose.yml    # PostgreSQL + API + aplicación
└── render.yaml           # Infraestructura de producción (blueprint de Render)
```

### Opción A: Docker (recomendada)

Requiere Docker Desktop.

```bash
docker compose up --build
```

Esto levanta PostgreSQL, ejecuta las migraciones, carga el CSV y sirve:

- Aplicación: http://localhost:8080
- API: http://localhost:8000/api/
- Documentación de la API: http://localhost:8000/api/docs/

Se detiene con `docker compose down` (agrega `-v` para borrar también el volumen de la base de datos).

### Opción B: Instalación manual

Requiere Python 3.13 y Node.js 22.

**Backend** (desde `backend/`):

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
cp .env.example .env              # luego define SECRET_KEY
python manage.py migrate
python manage.py load_transactions ../data/transactions.csv
python manage.py test
python manage.py runserver        # http://localhost:8000
```

Genera un `SECRET_KEY` con `python -c "import secrets; print(secrets.token_urlsafe(50))"`. El comando de carga es idempotente: si se ejecuta de nuevo, actualiza las filas en lugar de duplicarlas.

**Frontend** (desde `frontend/`):

```bash
npm ci
cp .env.example .env
npm test
npm run dev                       # http://localhost:5173
```

Otros comandos útiles: `npm run lint`, `npm run format`, `npm run build`, y `ruff check .` / `ruff format .` en el backend.

### Variables de entorno

| Variable | Dónde | Descripción |
| --- | --- | --- |
| `SECRET_KEY` | backend | Clave secreta de Django (obligatoria) |
| `DEBUG` | backend | `True` en desarrollo; por defecto `False` |
| `ALLOWED_HOSTS` | backend | Hosts permitidos, separados por comas |
| `DATABASE_URL` | backend | URL de la base de datos; por defecto SQLite (`postgres://usuario:clave@host:5432/db` para PostgreSQL) |
| `CORS_ALLOWED_ORIGINS` | backend | Orígenes del frontend que pueden llamar a la API |
| `CSRF_TRUSTED_ORIGINS` | backend | Orígenes HTTPS que pueden enviar formularios (admin de Django) |
| `VITE_API_URL` | frontend | URL base de la API (se lee al compilar) |

## Despliegue

La aplicación se despliega automáticamente en cada merge a `main`:

| Pieza | Plataforma | Configuración |
| --- | --- | --- |
| API + PostgreSQL | Render | [`render.yaml`](render.yaml) (Blueprint) |
| Frontend | Vercel | [`frontend/vercel.json`](frontend/vercel.json) |

Para reproducirlo desde cero:

1. **Render** → *New* → *Blueprint* → elegir este repositorio. Se crean `payflow-api` (servicio web con Docker, a partir de `backend/Dockerfile`) y `payflow-db` (PostgreSQL). `SECRET_KEY` se genera automáticamente y `DATABASE_URL` se conecta sola a la base de datos; `ALLOWED_HOSTS` y el origen de CSRF se toman de `RENDER_EXTERNAL_HOSTNAME`. Al arrancar, el contenedor ejecuta las migraciones y la carga idempotente del CSV.
2. **Vercel** → importar el repositorio con *Root Directory* `frontend` y la variable `VITE_API_URL=https://<servicio>.onrender.com/api`. Como Vite escribe esta URL en el bundle al compilar, si cambia hay que volver a desplegar.
3. **Render** → en `payflow-api`, definir `CORS_ALLOWED_ORIGINS=https://<app>.vercel.app` (el origen exacto, sin `/` al final).

## API

Documentación interactiva: `/api/docs/` (esquema OpenAPI en `/api/schema/`).

| Endpoint | Descripción |
| --- | --- |
| `GET /api/transactions/` | Listado paginado con filtros, búsqueda y ordenamiento |
| `GET /api/transactions/<transaction_id>/` | Detalle de una transacción |
| `GET /api/transactions/export/` | Transacciones filtradas en CSV (sin paginar) |
| `GET /api/metrics/summary/` | Monto aprobado, transacciones, ticket promedio, tasa de aprobación y clientes únicos |
| `GET /api/metrics/monthly/` | Por mes: monto aprobado, transacciones y tasa de aprobación |
| `GET /api/metrics/by-category/` | Por categoría: monto aprobado, transacciones y participación sobre el monto aprobado |
| `GET /api/metrics/by-channel/` | Por canal: transacciones y distribución por estado |
| `GET /api/metrics/top-customers/` | Todos los clientes ordenados por monto aprobado (sin paginar) |

**Parámetros de `/api/transactions/`**

| Parámetro | Ejemplo |
| --- | --- |
| `page`, `page_size` (por defecto 20, máximo 100) | `?page=2&page_size=50` |
| `status`, `channel`, `category`, `city` | `?status=Aprobada&city=Cali` |
| `date_from`, `date_to` (inclusivas, hora de Colombia) | `?date_from=2025-11-01&date_to=2025-11-30` |
| `amount_min`, `amount_max` | `?amount_min=100000` |
| `search` (ID, nombre del cliente o comercio) | `?search=uber` |
| `ordering` (`created_at`, `amount`; `-` para descendente) | `?ordering=-amount` |

Las respuestas paginadas incluyen `count`, `next`, `previous`, `total_pages` y `results`. Cada transacción incluye dos campos derivados: `amount_range` (Bajo / Medio / Alto) y `weekday` (en español). Todos los endpoints de métricas aceptan `date_from` y `date_to`.

## Decisiones técnicas

### Modelo de datos

El CSV es una tabla plana que mezcla tres entidades. Antes de modelar, verifiqué las dependencias funcionales en los datos: cada `customer_id` tiene siempre el mismo nombre, tipo y ciudad, y cada comercio tiene siempre la misma categoría. El modelo está en **tercera forma normal**:

- **`Customer`** (`customer_id`, nombre, tipo, ciudad), **`Merchant`** (nombre, categoría) y **`Transaction`**, que referencia a ambos. Sin esto, los datos del cliente se repetirían en cada transacción y podrían quedar inconsistentes (por ejemplo, un mismo cliente con dos ciudades).
- **`Category` no es una tabla**: es una lista fija de diez valores sin atributos propios, así que es un campo `TextChoices` de `Merchant`. Estado, canal, ciudad y tipo de cliente también son `TextChoices`.
- **Claves primarias sustitutas más claves naturales únicas** (`transaction_id`, `customer_id`, nombre del comercio). Las llaves foráneas son enteros pequeños, y las claves naturales se usan en las URLs de la API y para la carga idempotente.
- **`on_delete=PROTECT`**: no se puede borrar un cliente o comercio con transacciones, porque los registros financieros deben conservarse.
- **Montos como enteros** (`PositiveBigIntegerField`): el peso colombiano no se usa con centavos, los enteros son exactos (nunca flotantes para dinero) y rápidos de agregar.
- **Índices** en los campos que se usan para filtrar y ordenar (`created_at`, `amount`, `channel`, `city`, `category`) y un índice compuesto `(status, created_at)` para la consulta más común de las métricas ("transacciones aprobadas en un rango de fechas"). Primero la columna de igualdad y después la de rango; `status` no necesita índice propio porque es el prefijo izquierdo del compuesto.
- **Restricciones en la base de datos**: monto mayor que cero, cuotas entre 1 y 36, y más de una cuota solo con tarjeta de crédito (`installments = 1 OR channel = tarjeta crédito`). La base de datos es la última línea de defensa, sin importar por dónde entren los datos.
- **`USE_TZ` con `TIME_ZONE = "America/Bogota"`**: las fechas se guardan en UTC, y la agrupación mensual, los filtros de fecha y el día de la semana usan la hora de Colombia. Una compra del 31 de octubre a las 9 p. m. cuenta en octubre, aunque en UTC ya sea 1 de noviembre (cubierto por tests).

### Carga del CSV

`python manage.py load_transactions <ruta>` usa **upserts en lote** (`bulk_create(update_conflicts=True)`) sobre las claves naturales: primero clientes, luego comercios y luego transacciones, dentro de una sola transacción atómica. Hace unas pocas consultas en lugar de ~15.000 (`update_or_create` por fila), es idempotente, y si una fila es inválida no se guarda nada.

### API

- **ViewSets de solo lectura**: solo los endpoints que la herramienta necesita, sin operaciones de escritura.
- **Sin consultas N+1**: el listado usa `select_related("customer", "merchant")`. Una página de 100 resultados hace 2 consultas (conteo + página) en lugar de 202, y un test (`assertNumQueries`) lo garantiza.
- **Paginación por página personalizada** que agrega `total_pages` (y lo documenta en el esquema OpenAPI).
- **Filtros con django-filter**: los filtros de opciones devuelven `400` ante valores desconocidos. Los filtros de fecha convierten las fechas en rangos de datetimes con zona horaria en lugar de usar `__date`, para que se pueda usar el índice de `created_at`.
- **Orden estable**: siempre se agrega `-id` como desempate, para que las páginas nunca repitan ni salten filas al ordenar por valores que pueden empatar.
- **Campos derivados como propiedades del modelo** (`amount_range`, `weekday`): se calculan al vuelo, nunca se guardan, y los reutilizan el serializer y la exportación a CSV.
- **Métricas en un módulo de servicios** (`transactions/metrics.py`), separado de las vistas. Las agregaciones se hacen en la base de datos con el ORM (`aggregate`, `annotate`, `TruncMonth`, `Count`/`Sum` condicionales con `filter=Q(...)`), con una consulta por endpoint. Los serializers de respuesta funcionan como contrato para la documentación y la salida.
- **Exportación a CSV** con streaming (`StreamingHttpResponse` + `iterator()`) y memoria constante; reutiliza los filtros del listado y agrega un BOM UTF-8 para que Excel muestre bien las tildes.

### Frontend

- **Capas**: `api/` (el único código que conoce HTTP y las URLs), `hooks/` (obtención de datos con TanStack Query y lógica reutilizable), `components/` (UI separada por página más componentes compartidos en `ui/`), `pages/`, `types/` (contratos de TypeScript que reflejan los serializers), `utils/` y `constants/`.
- **TanStack Query** para el estado del servidor: caché (`staleTime` de 5 min), estados de carga y error, deduplicación de peticiones y nueva consulta cuando cambia la clave (los filtros).
- **Dashboard**: un único estado de rango de fechas, "levantado" a la página, que actualiza los KPIs, las tres gráficas y la tabla de top clientes.
- **Página de transacciones**: la URL es la única fuente de verdad para la página, el tamaño de página, los filtros, la búsqueda, el orden y el detalle abierto; los valores de la URL se validan al leerlos. La búsqueda tiene debounce (400 ms) y `keepPreviousData` evita el parpadeo entre páginas. El detalle usa un `<dialog>` nativo (atrapa el foco, se cierra con Escape y trae el fondo oscuro sin código extra).
- **Formato con `Intl`**: `$ 1.234.567` para COP y fechas en hora de Colombia.
- **Modo oscuro con tokens de color semánticos** (`bg-surface`, `text-fg`…) definidos como variables CSS, en lugar de duplicar cada color con `dark:`. El tema sigue la preferencia del sistema operativo hasta que el usuario elige uno, y un script en línea evita el destello blanco al cargar.
- **Code splitting**: las páginas del dashboard (gráficas) y de transacciones se cargan bajo demanda, así la landing no descarga Recharts.

### Calidad y flujo de trabajo

- **GitHub Flow**: una rama y un pull request por funcionalidad, merge commits para conservar el historial detallado, y un ruleset en `main` que exige PR y CI en verde.
- **CI (GitHub Actions)** en cada push y PR: Ruff, checks de Django, verificación de migraciones faltantes, validación del esquema OpenAPI y tests del backend; ESLint, verificación de Prettier, build de TypeScript y tests del frontend.
- **Conventional Commits**.

### Infraestructura

- **Docker**: la imagen del backend instala las dependencias en una capa cacheada, recolecta los archivos estáticos en el build y corre con un usuario sin privilegios; su entrypoint ejecuta las migraciones y la carga idempotente antes de gunicorn. La imagen del frontend es un build multi-stage (Node compila, nginx sirve) con fallback para la SPA.
- **Producción**: gunicorn en lugar de `runserver`, whitenoise para los archivos estáticos, `DEBUG=False` y PostgreSQL. `render.yaml` describe la API y la base de datos como código (clave secreta generada, URL de la base de datos conectada automáticamente), y Vercel sirve el frontend. Ambos se despliegan solos en cada merge a `main`.

## Paginación server-side vs client-side

| | Server-side (tabla de transacciones) | Client-side (tabla de top clientes) |
| --- | --- | --- |
| Quién pagina | El backend (`LIMIT`/`OFFSET`) | El navegador (`slice`) |
| Qué se descarga | Solo la página actual | Toda la lista, una vez |
| Cambio de página, filtro, búsqueda u orden | Una petición nueva | Ninguna petición: instantáneo |
| Escala hasta | Cualquier volumen (millones de filas) | Cientos o pocos miles de filas |

**Server-side** se usa para las transacciones porque son muchas y crecen sin límite: descargarlas todas sería lento y pesado, así que cada cambio de página, filtro, búsqueda u orden le pide a la API solo lo que se muestra, y `count`/`total_pages` reflejan el resultado filtrado.

**Client-side** se usa para el top de clientes: se descargan una sola vez 400 filas livianas, y la búsqueda (sin importar tildes), el ordenamiento por columna y la paginación (10 filas por página) ocurren en el navegador sin peticiones adicionales. Está implementado con dos hooks genéricos (`useSort`, `useClientPagination`) y el mismo componente `Pagination` de la tabla server-side.

**Cuándo usar cada una:** server-side cuando el dataset es grande, crece con el tiempo o no debe exponerse completo; client-side cuando la lista es pequeña y acotada, y las interacciones instantáneas importan más que la descarga inicial.

## Supuestos

- **La ciudad** pertenece al cliente: en el dataset cada cliente tiene siempre la misma ciudad. Si significara la ciudad de cada compra, pasaría a `Transaction`.
- **El número de transacciones** cuenta todos los estados; **el ticket promedio** usa solo las transacciones aprobadas.
- **Tasa de aprobación** = aprobadas / todas las transacciones × 100 (las pendientes cuentan en el total).
- **Clientes únicos**: clientes con al menos una transacción en el período.
- **Participación por categoría** = monto aprobado de la categoría / monto aprobado total.
- **Top clientes**: clientes con transacciones en el período seleccionado, ordenados por monto aprobado; la "última compra" es la última transacción **aprobada**.
- El filtro global de fechas del dashboard también aplica a la tabla de top clientes.

## Pendientes y mejoras

- **Autenticación**: la API es pública y de solo lectura porque no se pidió autenticación; en producción estaría detrás del login de la empresa (por ejemplo, JWT o SSO).
- **Robustez de la carga**: validar los encabezados del CSV y los valores de las opciones antes de procesar, y convertir los errores de la base de datos en un `CommandError` claro con la fila que falló.
- **Validación**: rechazar `date_from` posterior a `date_to` con un `400` en lugar de devolver un resultado vacío.
- **Más tests**: tests del backend para búsqueda, ordenamiento y `by-channel`; tests del frontend para el hook del estado en la URL y las páginas; tests end-to-end (Playwright).
- **Rendimiento a escala**: paginación por cursor para tablas muy grandes, caché de los endpoints de métricas (por ejemplo, Redis) y agregados materializados si los datos crecieran a millones de filas.
- **Hosting**: el plan gratuito se suspende por inactividad y su PostgreSQL expira a los 30 días; un plan pago eliminaría el arranque en frío.

## Capturas de pantalla

**Landing**

![Landing page](docs/screenshots/landing.png)

**Dashboard**

![Dashboard](docs/screenshots/dashboard.png)

**Transacciones**

![Tabla de transacciones](docs/screenshots/transactions.png)

**Detalle de una transacción**

![Detalle de una transacción](docs/screenshots/transaction-detail.png)

**Modo claro**

![Landing en modo claro](docs/screenshots/light-mode.png)

**Vista móvil**

![Dashboard en un celular](docs/screenshots/mobile.png)
