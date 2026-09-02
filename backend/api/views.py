import os
import cv2
import csv
import json
from django.conf import settings
from django.http import StreamingHttpResponse, JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from ultralytics import YOLO
from .models import Incident
from datetime import datetime

# Global state (simplified for demo)
analysis_running = False
show_overlays = True
current_video_path = None

# Initialize YOLO model (will download yolov8n.pt if not present)
try:
    model = YOLO('yolov8n.pt')
except Exception as e:
    print(f"Error loading YOLO model: {e}")
    model = None

@csrf_exempt
def upload_video(request):
    global current_video_path
    if request.method == 'POST' and request.FILES.get('video'):
        video = request.FILES['video']
        
        # Create media directory if it doesn't exist
        os.makedirs(settings.MEDIA_ROOT, exist_ok=True)
        
        file_path = os.path.join(settings.MEDIA_ROOT, 'uploaded_video.mp4')
        with open(file_path, 'wb+') as destination:
            for chunk in video.chunks():
                destination.write(chunk)
                
        current_video_path = file_path
        return JsonResponse({'status': 'success', 'message': 'Video uploaded successfully'})
    return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=400)

@csrf_exempt
def start_analysis(request):
    global analysis_running
    analysis_running = True
    return JsonResponse({'status': 'success'})

@csrf_exempt
def stop_analysis(request):
    global analysis_running
    analysis_running = False
    return JsonResponse({'status': 'success'})

@csrf_exempt
def toggle_overlay(request):
    global show_overlays
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            show_overlays = data.get('show_overlays', True)
            return JsonResponse({'status': 'success', 'show_overlays': show_overlays})
        except:
            pass
    return JsonResponse({'status': 'error'}, status=400)

# Track last DB write to prevent spam
last_db_write = 0

def generate_frames():
    global analysis_running, show_overlays, current_video_path, model, last_db_write
    import time
    
    if not current_video_path or not os.path.exists(current_video_path):
        return
        
    cap = cv2.VideoCapture(current_video_path)
    
    while analysis_running and cap.isOpened():
        success, frame = cap.read()
        if not success:
            # Loop the video for demo purposes
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            continue
            
        # Run YOLO inference
        if model:
            results = model(frame, stream=True, verbose=False)
            
            for r in results:
                boxes = r.boxes
                for box in boxes:
                    conf = float(box.conf[0])
                    cls = int(box.cls[0])
                    
                    # For demo: Log any person detection (class 0) as a potential anomaly
                    if cls == 0 and conf > 0.5:
                        current_time = time.time()
                        if current_time - last_db_write > 2: # Throttle DB writes
                            Incident.objects.create(confidence_score=conf)
                            last_db_write = current_time
                    
                    if show_overlays:
                        x1, y1, x2, y2 = box.xyxy[0]
                        x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
                        
                        # Draw bounding box
                        color = (0, 255, 0) if cls == 0 else (255, 0, 255)
                        cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                        
                        # Draw label
                        label = f"{model.names[cls]} {conf:.2f}"
                        cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
        
        # Encode frame for streaming
        ret, buffer = cv2.imencode('.jpg', frame)
        if not ret:
            continue
            
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
               
    cap.release()

@csrf_exempt
def video_feed(request):
    return StreamingHttpResponse(generate_frames(), content_type='multipart/x-mixed-replace; boundary=frame')

@csrf_exempt
def download_report(request):
    incidents = Incident.objects.all().order_by('-timestamp')
    
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="incident_report.csv"'
    
    writer = csv.writer(response)
    writer.writerow(['Timestamp', 'Camera ID', 'Confidence Score'])
    
    for incident in incidents:
        # Convert timestamp to local naive for export if needed, or leave as UTC
        timestamp_str = incident.timestamp.strftime('%Y-%m-%d %H:%M:%S') if incident.timestamp else "Unknown"
        writer.writerow([
            timestamp_str,
            incident.camera_id,
            f"{incident.confidence_score:.2f}"
        ])
        
    return response
