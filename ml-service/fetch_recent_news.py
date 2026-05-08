import requests
import xml.etree.ElementTree as ET
import pandas as pd
import os
from datetime import datetime

# RSS Feeds that require NO API KEY and are updated constantly (including yesterday/today)
RSS_FEEDS = [
    "http://feeds.bbci.co.uk/news/world/rss.xml",
    "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
    "https://www.aljazeera.com/xml/rss/all.xml"
]

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

def fetch_fast_news():
    print("Fetching the latest real news (including yesterday) fast...")
    os.makedirs(DATA_DIR, exist_ok=True)
    
    news_items = []
    
    for url in RSS_FEEDS:
        try:
            print(f"Fetching from {url}...")
            response = requests.get(url, timeout=10)
            if response.status_code == 200:
                root = ET.fromstring(response.content)
                # Parse RSS items
                for item in root.findall('.//item'):
                    title = item.find('title').text if item.find('title') is not None else ""
                    description = item.find('description').text if item.find('description') is not None else ""
                    pub_date = item.find('pubDate').text if item.find('pubDate') is not None else "Unknown Date"
                    
                    full_text = f"{title}. {description}".strip()
                    if full_text:
                        news_items.append({
                            "text": full_text,
                            "label": 1, # Real news from reliable sources
                            "date": pub_date,
                            "source": url
                        })
        except Exception as e:
            print(f"Error fetching from {url}: {e}")

    if news_items:
        df = pd.DataFrame(news_items)
        save_path = os.path.join(DATA_DIR, "recent_real_news.csv")
        df.to_csv(save_path, index=False)
        print(f"\nSUCCESS! Downloaded {len(df)} real news articles extremely fast.")
        print(f"Saved to: {save_path}")
        print("Here are the top 3 headlines fetched:")
        for idx, row in df.head(3).iterrows():
            print(f"- {row['text'][:100]}...")
    else:
        print("Failed to fetch any news.")

if __name__ == "__main__":
    fetch_fast_news()
