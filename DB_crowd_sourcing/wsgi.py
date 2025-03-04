"""
WSGI config for db project.

It exposes the WSGI callable as a modules-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "DB_crowd_sourcing.settings")

application = get_wsgi_application()
