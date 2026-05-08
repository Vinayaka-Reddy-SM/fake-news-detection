import os
import pandas as pd
import requests

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
CSV_PATH = os.path.join(DATA_DIR, "real_news_dataset.csv")
DATASET_URL = "https://s3.amazonaws.com/assets.datacamp.com/blog_assets/fake_or_real_news.csv"

def download_data():
    os.makedirs(DATA_DIR, exist_ok=True)
    if not os.path.exists(CSV_PATH):
        print(f"Downloading real-world dataset from {DATASET_URL}...")
        try:
            response = requests.get(DATASET_URL)
            response.raise_for_status()
            with open(CSV_PATH, 'wb') as f:
                f.write(response.content)
            print(f"Dataset downloaded successfully to {CSV_PATH}")
            
            # Basic validation
            df = pd.read_csv(CSV_PATH)
            print(f"Dataset loaded with {len(df)} rows and columns: {list(df.columns)}")
        except Exception as e:
            print(f"Failed to download dataset: {e}")
    else:
        print(f"Data already exists at {CSV_PATH}")

if __name__ == "__main__":
    download_data()
