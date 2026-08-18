from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, MediaViewSet

router = DefaultRouter()
router.register(r'media', MediaViewSet, basename='media')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('', include(router.urls)),
]
