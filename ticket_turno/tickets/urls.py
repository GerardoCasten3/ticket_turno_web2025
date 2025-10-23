from django.urls import path
from . import views

urlpatterns = [
    path('', views.ticket_view, name='ticket_view'),
    path('request_municipios/<int:estado_id>/', views.request_estado_municipios, name='request_estado_municipios'),
    path('post_ticket/', views.post_ticket, name='post_ticket'),
    path('get_ticket/<int:ticket_id>/', views.get_ticket, name='get_ticket'),
]
