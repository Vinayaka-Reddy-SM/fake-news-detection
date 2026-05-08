import os
import re
import joblib
import pandas as pd
import numpy as np
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, classification_report

nltk.download('stopwords', quiet=True)

MODEL_DIR = os.path.join(os.path.dirname(__file__), "model")
MODEL_PATH = os.path.join(MODEL_DIR, "fake_news_model.pkl")

stemmer = PorterStemmer()
stop_words = set(stopwords.words('english')) if nltk.data.find('corpora/stopwords') else set()

def preprocess_text(text):
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    words = text.split()
    words = [stemmer.stem(word) for word in words if word not in stop_words]
    return " ".join(words)

def train_model(csv_path, recent_csv_path=None):
    print("Loading data...")
    try:
        df = pd.read_csv(csv_path)
    except FileNotFoundError:
        print(f"Error: {csv_path} not found.")
        return False
        
    if recent_csv_path and os.path.exists(recent_csv_path):
        print(f"Loading recent news from {recent_csv_path}...")
        try:
            recent_df = pd.read_csv(recent_csv_path)
            df = pd.concat([df, recent_df], ignore_index=True)
            print(f"Combined dataset size: {len(df)}")
        except Exception as e:
            print(f"Warning: Failed to load recent news: {e}")

    if 'content' in df.columns:
        df = df.rename(columns={'content': 'text'})
        
    if 'label' in df.columns:
        df['label'] = df['label'].astype(str).str.lower().str.strip()
        df['label'] = df['label'].replace({'real': 1, 'fake': 0}).astype(int)
        
    df = df.dropna(subset=['text', 'label'])

    if "text" not in df.columns or "label" not in df.columns:
        print(f"Error: dataset must contain 'text' and 'label' columns. Found: {df.columns}")
        return False

    print("Preprocessing text...")
    df['clean_text'] = df['text'].apply(preprocess_text)

    X = df['clean_text']
    y = df['label']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    print("Training model...")
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(max_features=50000, ngram_range=(1,2))),
        ('clf', LogisticRegression(max_iter=1000, C=1.0))
    ])

    pipeline.fit(X_train, y_train)

    print("Evaluating model...")
    y_pred = pipeline.predict(X_test)
    
    print("\n--- Evaluation Metrics ---")
    print(f"Accuracy:  {accuracy_score(y_test, y_pred):.4f}")
    print(f"Precision: {precision_score(y_test, y_pred):.4f}")
    print(f"Recall:    {recall_score(y_test, y_pred):.4f}")
    print(f"F1-score:  {f1_score(y_test, y_pred):.4f}")
    print("\nConfusion Matrix:")
    print(confusion_matrix(y_test, y_pred))
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(pipeline, MODEL_PATH)
    print(f"Model saved to {MODEL_PATH}")
    return True

if __name__ == "__main__":
    CSV_PATH = os.path.join(os.path.dirname(__file__), "data", "real_news_dataset.csv")
    RECENT_CSV_PATH = os.path.join(os.path.dirname(__file__), "data", "recent_real_news.csv")
    
    # Ensure data exists before training
    if not os.path.exists(CSV_PATH):
        print("Dataset not found. Please run download_data.py first.")
    else:
        train_model(CSV_PATH, RECENT_CSV_PATH)
