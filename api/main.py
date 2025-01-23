from fastapi import FastAPI, File, UploadFile
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models for nail, palm, and eye detection

MODEL_PALM = tf.keras.models.load_model("../Model/palmResNet.keras")
MODEL_NAIL = tf.keras.models.load_model("../Model/nailResNet.keras")
MODEL_EYE = tf.keras.models.load_model("../Model/eyeResNet.keras")
#MODEL_EYE = tf.keras.models.load_model("../saved_model_eye/1.keras")

# Class names for prediction results
CLASS_NAMES = ["Anemic", "Non_Anemic"]

@app.get("/ping")
async def ping():
    return "alive"
def read_image(data) -> np.ndarray:
    image = Image.open(BytesIO(data)).convert("RGB")
    image = image.resize((256, 256))  # Resize to model's expected input size
    image = np.array(image)
    return image



# Function to process uploaded images
def read_file_as_image(data) -> np.ndarray:
    image = Image.open(BytesIO(data)).convert("RGB")
    image = np.array(image)
    return image

@app.post("/predict")
async def predict(
    nail: UploadFile = File(...), 
    palm: UploadFile = File(...), 
    eye: UploadFile = File(...)
):  
    # Ensure all uploaded files are images
    for file in [nail, palm, eye]:
        if not file.content_type.startswith("image/"):
            return {"error": f"File {file.filename} is not an image"}

    # Read images
    nail_image = read_image(await nail.read())
    palm_image = read_image(await palm.read())
    eye_image = read_image(await eye.read())

    # Prepare images for model prediction
    nail_batch = np.expand_dims(nail_image, 0)
    palm_batch = np.expand_dims(palm_image, 0)
    eye_batch = np.expand_dims(eye_image, 0)

    # Predict using the respective models
    nail_prediction = MODEL_NAIL.predict(nail_batch)
    palm_prediction = MODEL_PALM.predict(palm_batch)
    eye_prediction = MODEL_EYE.predict(eye_batch)

    # Extract prediction results
    nail_class = CLASS_NAMES[np.argmax(nail_prediction[0])]
    nail_confidence = np.max(nail_prediction[0])

    palm_class = CLASS_NAMES[np.argmax(palm_prediction[0])]
    palm_confidence = np.max(palm_prediction[0])

    eye_class = CLASS_NAMES[np.argmax(eye_prediction[0])]
    eye_confidence = np.max(eye_prediction[0])


    # Print results to terminal
    print("\n--- Prediction Results ---")
    print(f"Nail: {nail_class} (Confidence: {nail_confidence:.2f})")
    print(f"Palm: {palm_class} (Confidence: {palm_confidence:.2f})")
    print(f"Eye: {eye_class} (Confidence: {eye_confidence:.2f})")


    
# Print results to terminal
    print("\n--- Prediction Results ---")
    print(f"Nail: {nail_class} (Confidence: {nail_confidence:.2f})")
    print(f"Palm: {palm_class} (Confidence: {palm_confidence:.2f})")
    print(f"Eye: {eye_class} (Confidence: {eye_confidence:.2f})")
    # Combine results
    predictions = [
        {"class": nail_class, "confidence": nail_confidence},
        {"class": palm_class, "confidence": palm_confidence},
        {"class": eye_class, "confidence": eye_confidence}
    ]

    # Determine overall result using majority voting
    anemic_count = sum(1 for p in predictions if p["class"] == "Anemic")
    non_anemic_count = sum(1 for p in predictions if p["class"] == "Non_Anemic")

    if anemic_count > non_anemic_count:
        final_class = "Anemic"
    else:
        final_class = "Non_Anemic"

    # Calculate the average confidence score
    average_confidence = sum(p["confidence"] for p in predictions) / len(predictions)
     # Print final result to terminal
    print(f"Final Result: {final_class} (Average Confidence: {average_confidence:.2f})")
    print("--------------------------\n")
    return {
        "nail": {"class": nail_class, "confidence": float(nail_confidence)},
        "palm": {"class": palm_class, "confidence": float(palm_confidence)},
        "eye": {"class": eye_class, "confidence": float(eye_confidence)},
        "final_result": {"class": final_class, "average_confidence": float(average_confidence)}
    }

if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=8000)
