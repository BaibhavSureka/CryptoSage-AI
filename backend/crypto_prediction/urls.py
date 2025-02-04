from django.urls import path
from .views import get_portfolio, optimize_portfolio,create_portfolio

urlpatterns = [
    path('portfolio/', get_portfolio, name='get_portfolio'),
    path('optimize/', optimize_portfolio, name='optimize_portfolio'),
    path('create_portfolio/', create_portfolio, name='create_portfolio'),
]
