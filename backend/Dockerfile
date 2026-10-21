# Build context: repository root (needs backend/ and data/)
FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# Dependencies first: this layer is cached until requirements.txt changes
COPY backend/requirements.txt .
RUN pip install -r requirements.txt

COPY backend/ .
COPY data/transactions.csv data/transactions.csv

# Collect static files (admin, browsable API) at build time; the key is only needed to boot Django
RUN SECRET_KEY=build-only-secret python manage.py collectstatic --noinput

# Never run the app as root inside the container
RUN useradd --create-home appuser && chown -R appuser /app
USER appuser

EXPOSE 8000

ENTRYPOINT ["./entrypoint.sh"]