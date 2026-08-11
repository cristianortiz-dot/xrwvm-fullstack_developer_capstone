"""djangoproj URL Configuration"""
from django.contrib import admin
from django.urls import include, path
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('djangoapp/', include('djangoapp.urls')),

    # Páginas estáticas
    path('about/', TemplateView.as_view(template_name="About.html")),
    path('contact/', TemplateView.as_view(template_name="Contact.html")),

    # Rutas renderizadas por React (SPA)
    path('login/', TemplateView.as_view(template_name="index.html")),
    path('register/', TemplateView.as_view(template_name="index.html")),
    path('dealers/', TemplateView.as_view(template_name="index.html")),
    path('dealer/<int:dealer_id>', TemplateView.as_view(template_name="index.html")),
    path('postreview/<int:dealer_id>', TemplateView.as_view(template_name="index.html")),

    # Página de inicio
    path('', TemplateView.as_view(template_name="Home.html"), name='home'),
]
