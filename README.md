# fullstack_developer_capstone

**Best Cars Dealership Review Application** — Proyecto final del curso *IBM Full Stack Software Developer Professional Certificate*.

> Nombre del proyecto (requerido para la entrega calificada por IA): **fullstack_developer_capstone**

## Descripción

Aplicación web full stack para una red de concesionarios de autos ("Best Cars") que permite a los usuarios:

- Consultar información de la empresa (About Us) y datos de contacto (Contact Us).
- Registrarse, iniciar sesión y cerrar sesión.
- Ver la lista de concesionarios y filtrarlos por estado.
- Ver el detalle de un concesionario y sus reseñas, incluyendo el análisis de
  sentimiento (positivo / neutral / negativo) de cada reseña.
- Publicar una nueva reseña sobre un concesionario (solo usuarios autenticados).
- Administrar marcas (`CarMake`) y modelos (`CarModel`) de autos desde el panel
  de administración de Django.

## Arquitectura

| Componente | Tecnología | Carpeta |
|---|---|---|
| Backend web / vistas / autenticación | Django | `server/djangoproj`, `server/djangoapp` |
| Frontend SPA | React | `server/frontend` |
| Páginas estáticas (Home, About, Contact) | HTML + CSS | `server/frontend/static` |
| Microservicio de concesionarios y reseñas | Node.js + Express + MongoDB (Mongoose) | `server/database` |
| Microservicio de análisis de sentimientos | Python + Flask + NLTK (VADER) | `server/djangoapp/microservices` |
| Integración Continua | GitHub Actions (flake8 + JSHint) | `.github/workflows/main.yml` |
| Contenerización | Docker / Docker Compose / Kubernetes | `Dockerfile`, `deployment.yaml`, `docker-compose.yml` |

```
Usuario → React / HTML estático → Django (vistas proxy) → Node/Express + MongoDB (concesionarios y reseñas)
                                                        → Flask + NLTK (análisis de sentimientos)
```

## Estructura del repositorio

```
xrwvm-fullstack_developer_capstone/
├── .github/workflows/main.yml       # CI: lint Python (flake8) y JS (JSHint)
├── server/
│   ├── manage.py
│   ├── requirements.txt
│   ├── Dockerfile / entrypoint.sh / deployment.yaml
│   ├── djangoproj/                  # settings.py, urls.py, wsgi.py
│   ├── djangoapp/                   # models.py, views.py, urls.py, restapis.py, populate.py
│   │   └── microservices/           # sentiment_analyzer.py (Flask + NLTK)
│   ├── frontend/                    # React app
│   │   ├── src/components/Login, Register, Dealers
│   │   └── static/                  # Home.html, About.html, Contact.html, style.css
│   └── database/                    # Express + MongoDB (Mongoose)
│       ├── app.js
│       ├── models/ (review.js, dealership.js)
│       └── data/ (reviews.json, dealerships.json)
├── LICENSE
└── README.md
```

## Puesta en marcha en local

### 1. Backend Django

```bash
cd server
python3 -m venv djangoenv
source djangoenv/bin/activate
python3 -m pip install -U -r requirements.txt
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py createsuperuser
python3 manage.py runserver
```

La aplicación quedará disponible en `http://localhost:8000/`.

### 2. Frontend React

```bash
cd server/frontend
npm install
npm run build
```

Django sirve automáticamente los archivos estáticos generados en `server/frontend/build`.

### 3. Microservicio de concesionarios y reseñas (Node + MongoDB)

```bash
cd server/database
docker build . -t nodeapp
docker-compose up
```

Disponible en `http://localhost:3030/`.

### 4. Microservicio de análisis de sentimientos (Flask + NLTK)

```bash
cd server/djangoapp/microservices
docker build . -t sentiment_analyzer
docker run -p 5050:5050 sentiment_analyzer
```

Disponible en `http://localhost:5050/`.

### 5. Variables de entorno

Crea un archivo `.env` dentro de `server/` (puedes copiar `.env.example`) con:

```
BACKEND_URL=http://localhost:3030/
SENTIMENT_ANALYZER_URL=http://localhost:5050/
```

## Endpoints principales

### Django (`/djangoapp/...`)

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/djangoapp/login` | Inicia sesión |
| GET | `/djangoapp/logout` | Cierra sesión |
| POST | `/djangoapp/register` | Registra un usuario nuevo |
| GET | `/djangoapp/get_cars` | Lista de marcas y modelos de autos |
| GET | `/djangoapp/get_dealers` | Lista de todos los concesionarios |
| GET | `/djangoapp/get_dealers/<state>` | Concesionarios filtrados por estado |
| GET | `/djangoapp/dealer/<id>` | Detalle de un concesionario |
| GET | `/djangoapp/reviews/dealer/<id>` | Reseñas de un concesionario (con sentimiento) |
| POST | `/djangoapp/add_review` | Publica una reseña |

### Microservicio Node/Express (`/...`)

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/fetchDealers` | Todos los concesionarios |
| GET | `/fetchDealers/:state` | Concesionarios por estado |
| GET | `/fetchDealer/:id` | Concesionario por id |
| GET | `/fetchReviews` | Todas las reseñas |
| GET | `/fetchReviews/dealer/:id` | Reseñas de un concesionario |
| POST | `/insert_review` | Inserta una reseña |

### Microservicio de sentimientos (Flask)

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/analyze/<text>` | Devuelve `positive`, `neutral` o `negative` |

## Integración y despliegue continuo

El flujo `.github/workflows/main.yml` ejecuta automáticamente, en cada `push` o
`pull_request` a `main`/`master`:

1. **lint_python** — instala `flake8` y valida todos los archivos `.py`.
2. **lint_js** — instala `jshint` y valida todos los archivos `.js` de `server/database`.

## Despliegue

La aplicación Django se contenedoriza con el `Dockerfile` en `server/` y puede
desplegarse en cualquier plataforma compatible con contenedores (Kubernetes,
IBM Code Engine, Google Cloud Run, Render, Railway, etc.) usando el archivo
`server/deployment.yaml` como referencia para Kubernetes.

## Autor

Cristian Ortiz — Proyecto desarrollado como parte del *IBM Full Stack Software Developer Professional Certificate*.

## Licencia

Este proyecto está licenciado bajo Apache License 2.0 — ver [LICENSE](LICENSE).
