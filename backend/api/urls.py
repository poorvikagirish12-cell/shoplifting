from django.urls import path
from . import views

urlpatterns = [
    path('upload_video/', views.upload_video, name='upload_video'),
    path('video_feed/', views.video_feed, name='video_feed'),
    path('toggle_overlay/', views.toggle_overlay, name='toggle_overlay'),
    path('start_analysis/', views.start_analysis, name='start_analysis'),
    path('stop_analysis/', views.stop_analysis, name='stop_analysis'),
    path('download_report/', views.download_report, name='download_report'),
]
