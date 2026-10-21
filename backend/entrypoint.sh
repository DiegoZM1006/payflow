#!/bin/sh
set -e

# Safe to run on every start: migrations are tracked and the loader is idempotent
python manage.py migrate --noinput
python manage.py load_transactions data/transactions.csv

exec gunicorn config.wsgi:application --bind "0.0.0.0:${PORT:-8000}" --workers "${WEB_CONCURRENCY:-2}"