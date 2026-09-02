from django.db import models

class Incident(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    confidence_score = models.FloatField()
    camera_id = models.CharField(max_length=100, default='CAM_01')

    def __str__(self):
        return f"Incident at {self.timestamp} (Confidence: {self.confidence_score})"
