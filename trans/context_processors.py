import trans
from django.conf import settings
from datetime import datetime, date

def version(request):
    return {'version': trans.VERSION}

def title(request):
    return {'site_title': settings.SITE_TITLE}

def date(request):
    return {
        'current_date': datetime.utcnow().strftime('%Y-%m-%d'),
        'current_year': datetime.utcnow().strftime('%Y'),
        'current_month': datetime.utcnow().strftime('%m'),
        }
