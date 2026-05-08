# TruthCheck AI

A full-stack fake news detection web application.

## Prerequisites
Node.js 18+, Python 3.9+, MongoDB Atlas account

## Step 1 — ML Microservice:
```bash
cd ml-service
pip install -r requirements.txt
python -c "import nltk; nltk.download('stopwords')"
uvicorn main:app --port 8001 --reload
```
Model trains on first run (saved to model/fake_news_model.pkl).

## Step 2 — Node Backend:
```bash
cd server
npm install
cp .env.example .env   # fill in MONGO_URI + JWT_SECRET
npm run dev            # nodemon on port 5000
```

## Step 3 — React Frontend:
```bash
cd client
npm install
npm run dev            # Vite on port 3000
```

## Docker (optional)
```bash
docker-compose up --build
```
All three services start together.

## Environment Files
Server (`/server/.env`):
```
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/truthcheck
JWT_SECRET=supersecretkey123
ML_SERVICE_URL=http://localhost:8001
```

Client (`/client/.env`):
```
VITE_API_URL=http://localhost:5000
```
