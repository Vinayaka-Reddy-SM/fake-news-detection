import os
import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from contextlib import asynccontextmanager
from train import preprocess_text, MODEL_PATH
from download_data import CSV_PATH, download_data
from train import train_model

ml_models = {}
stats = {"total_predictions": 0, "fake_count": 0, "real_count": 0}

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load model on startup
    if not os.path.exists(MODEL_PATH):
        print("Model not found. Triggering data download and training...")
        if not os.path.exists(CSV_PATH):
            download_data()
        train_model(CSV_PATH)
    
    if os.path.exists(MODEL_PATH):
        ml_models["pipeline"] = joblib.load(MODEL_PATH)
        print("Model loaded successfully.")
    else:
        print("Failed to load or train model.")
    yield
    # Cleanup on shutdown
    ml_models.clear()

app = FastAPI(lifespan=lifespan)

class PredictRequest(BaseModel):
    text: str

class PredictResponse(BaseModel):
    label: str
    confidence: float
    fake_probability: float
    real_probability: float
    top_suspicious_words: list[str]

@app.get("/health")
def health_check():
    return {"status": "ok", "model_loaded": "pipeline" in ml_models}

@app.get("/stats")
def get_stats():
    return stats

@app.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest):
    if "pipeline" not in ml_models:
        raise HTTPException(status_code=503, detail="Model is not loaded")
    
    text = request.text.strip()
    if not text:
        raise HTTPException(status_code=422, detail="Text cannot be empty")
        
    if len(text.replace(" ", "")) == 0:
        raise HTTPException(status_code=422, detail="Text cannot be only spaces")

    pipeline = ml_models["pipeline"]
    clean_text = preprocess_text(text)
    
    # If text is extremely short or becomes empty after cleaning
    if len(clean_text) == 0:
        clean_text = "empty" # Fallback so vectorizer doesn't crash
    
    probs = pipeline.predict_proba([clean_text])[0]
    fake_prob = float(probs[0])
    real_prob = float(probs[1])
    
    label_idx = int(np.argmax(probs))
    label = "REAL" if label_idx == 1 else "FAKE"
    confidence = float(np.max(probs))

    # Extract suspicious words if FAKE
    top_suspicious_words = []
    if label == "FAKE":
        tfidf = pipeline.named_steps['tfidf']
        clf = pipeline.named_steps['clf']
        feature_names = np.array(tfidf.get_feature_names_out())
        
        # Transform the single text
        vec = tfidf.transform([clean_text])
        # Get non-zero features
        indices = vec.nonzero()[1]
        
        if len(indices) > 0:
            # For class 0 (FAKE), negative coefficients indicate FAKE if it's binary, 
            # or it depends on how classes are mapped. 
            # In our data, 0 is FAKE, 1 is REAL.
            # So lower (negative) coefficients mean more FAKE.
            coefs = clf.coef_[0][indices]
            # We want words with the most negative coefficients
            sorted_idx = np.argsort(coefs)
            top_indices = indices[sorted_idx[:10]]
            top_suspicious_words = feature_names[top_indices].tolist()

    stats["total_predictions"] += 1
    if label == "FAKE":
        stats["fake_count"] += 1
    else:
        stats["real_count"] += 1

    return PredictResponse(
        label=label,
        confidence=confidence,
        fake_probability=fake_prob,
        real_probability=real_prob,
        top_suspicious_words=top_suspicious_words
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
