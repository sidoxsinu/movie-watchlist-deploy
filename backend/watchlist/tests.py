from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from .models import Media

class AuthTests(APITestCase):
    def test_registration(self):
        url = reverse('auth_register')
        data = {'username': 'testuser', 'password': 'testpassword'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_protected_endpoints(self):
        url = reverse('media-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class MediaTests(APITestCase):
    def setUp(self):
        self.user_a = User.objects.create_user(username='usera', password='password')
        self.user_b = User.objects.create_user(username='userb', password='password')
        self.media_a = Media.objects.create(title="Movie A", type="movie", owner=self.user_a)
        self.media_b = Media.objects.create(title="Movie B", type="movie", owner=self.user_b)
        
    def test_ownership_isolation(self):
        self.client.force_authenticate(user=self.user_a)
        url = reverse('media-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Movie A')
        
    def test_create_media(self):
        self.client.force_authenticate(user=self.user_a)
        url = reverse('media-list')
        data = {'title': 'New Movie', 'type': 'movie'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Media.objects.filter(owner=self.user_a).count(), 2)

    def test_update_status_and_rating(self):
        self.client.force_authenticate(user=self.user_a)
        url = reverse('media-detail', args=[self.media_a.id])
        data = {'status': 'watched', 'rating': 5}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.media_a.refresh_from_db()
        self.assertEqual(self.media_a.status, 'watched')
        self.assertEqual(self.media_a.rating, 5)

    def test_invalid_rating(self):
        self.client.force_authenticate(user=self.user_a)
        url = reverse('media-detail', args=[self.media_a.id])
        data = {'rating': 6}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_cannot_access_others_media(self):
        self.client.force_authenticate(user=self.user_a)
        url = reverse('media-detail', args=[self.media_b.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
        response = self.client.patch(url, {'rating': 5}, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_media(self):
        self.client.force_authenticate(user=self.user_a)
        url = reverse('media-detail', args=[self.media_a.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Media.objects.filter(owner=self.user_a).count(), 0)
