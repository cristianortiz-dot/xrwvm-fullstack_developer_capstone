"""
Django settings for djangoproj project - Best Cars Dealership Review App.
"""
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get(
    'DJANGO_SECRET_KEY',
    'django-insecure-change-this-key-in-production-bestcars-2026'
)

DEBUG = os.environ.get('DJANGO_DEBUG', 'True') == 'True'

ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0']
# Añade la URL pública de tu aplicación (Theia / Code Engine / Cloud Run, etc.)
# ALLOWED_HOSTS += ['<your application URL here>']

CSRF_TRUSTED_ORIGINS = []
# CSRF_TRUSTED_ORIGINS += ['https://<your application URL here>']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'djangoapp',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'djangoproj.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'frontend/static'),
            os.path.join(BASE_DIR, 'frontend/build'),
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'djangoproj.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'frontend/static'),
    os.path.join(BASE_DIR, 'frontend/build'),
    os.path.join(BASE_DIR, 'frontend/build/static'),
]
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# URL del microservicio Node/Express + MongoDB (fetchDealers, fetchReviews, etc.)
BACKEND_URL = os.environ.get(
    'BACKEND_URL', 'http://localhost:3030/'
)

# URL del microservicio de análisis de sentimientos (NLTK) desplegado en Code Engine / Cloud Run
SENTIMENT_ANALYZER_URL = os.environ.get(
    'SENTIMENT_ANALYZER_URL', 'http://localhost:5050/'
)

ALLOWED_HOSTS += [
    'consultorcri-8000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai'
]
CSRF_TRUSTED_ORIGINS += [
    'https://consultorcri-8000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai'
]