from django.db import models
from django.contrib.auth.models import User

class Media(models.Model):
    TYPE_CHOICES = [
        ("movie", "Movie"),
        ("tv", "TV"),
    ]

    STATUS_CHOICES = [
        ("watched", "Watched"),
        ("unwatched", "Unwatched"),
    ]

    title = models.CharField(max_length=255)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="unwatched"
    )
    rating = models.PositiveSmallIntegerField(
        null=True,
        blank=True
    )
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="media"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.type})"
