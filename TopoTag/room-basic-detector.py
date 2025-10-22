import os
import cv2
import json
import numpy as np
from pupil_apriltags import Detector

# --- CONFIGURATION ---
TAG_SIZE = 0.05  # Tag size in meters

# Get absolute path of this script (so paths work regardless of where it's run)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load your map definition (relative to script)
map_path = os.path.join(BASE_DIR, "maps", "table-test.json")
with open(map_path, "r") as f:
    tag_map = json.load(f)["tags"]
world_positions = {t["id"]: np.array(t["position"]) for t in tag_map}

# Camera intrinsics (approximate — TODO: Calibrate properly)
fx, fy = 600, 600
cx, cy = 320, 240
camera_params = [fx, fy, cx, cy]

# Initialize AprilTag detector
detector = Detector(
    families="tag36h11",
    nthreads=4,
    quad_decimate=1.0,
    quad_sigma=0.0,
    refine_edges=True,
    decode_sharpening=0.25,
    debug=False,
)

# --- LOAD VIDEO INSTEAD OF CAMERA ---
video_path = os.path.join(BASE_DIR, "test-videos", "IMG_6082.mov")
cap = cv2.VideoCapture(video_path)

if not cap.isOpened():
    print(f"❌ Cannot open video file: {video_path}")
    exit()

while True:
    ret, frame = cap.read()
    if not ret:
        print("✅ Finished processing video.")
        break

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    detections = detector.detect(gray, estimate_tag_pose=True,
                                 camera_params=camera_params, tag_size=TAG_SIZE)

    camera_positions = []

    for d in detections:
        tag_id = d.tag_id
        if tag_id not in world_positions:
            continue

        # Pose of tag relative to camera
        R_cam_tag = np.array(d.pose_R)
        t_cam_tag = np.array(d.pose_t).reshape(3)

        # Compute camera pose relative to tag (invert transform)
        R_tag_cam = R_cam_tag.T
        t_tag_cam = -R_cam_tag.T @ t_cam_tag

        # Tag's world position
        t_world_tag = world_positions[tag_id]
        R_world_tag = np.eye(3)

        # Combine transforms: camera in world frame
        R_world_cam = R_world_tag @ R_tag_cam
        t_world_cam = R_world_tag @ t_tag_cam + t_world_tag
        camera_positions.append(t_world_cam)

        # Draw tag outline + ID
        corners = d.corners.reshape((-1, 1, 2)).astype(int)
        cv2.polylines(frame, [corners], True, (0, 255, 0), 2)
        cv2.putText(frame, f"ID {tag_id}", tuple(corners[0][0]),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 2)

    # Average all visible tags to estimate camera world position
    if camera_positions:
        camera_pos_world = np.mean(camera_positions, axis=0)
        print(f"Camera Position (x, y, z): {camera_pos_world}")

    cv2.imshow("AprilTag Detection (Video)", frame)

    # Quit with 'q'
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
