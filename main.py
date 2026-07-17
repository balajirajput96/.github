from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import numpy as np
from typing import List
from utils.logger import setup_logger

logger = setup_logger(__name__)

app = FastAPI(title="ML Model API")

class PredictionInput(BaseModel):
    # SECURITY ENHANCEMENT: Limit the number of features to prevent DoS attacks
    # via excessively large input lists.
    features: List[float] = Field(..., max_length=100)

@app.get("/")
def home():
    return {"message": "API Running!", "status": "active"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/predict")
def predict(data: PredictionInput):
    try:
        input_data = np.array([data.features])
        # Load your model: prediction = model.predict(input_data)
        prediction = np.random.random() * 100
        return {"prediction": float(prediction)}
    except Exception as e:
        logger.error(f"Prediction failed: {e}")
        raise HTTPException(status_code=500, detail="An internal error occurred")