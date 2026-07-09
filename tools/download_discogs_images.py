import csv
import os
import sys
import requests
import time

DISCOGS_TOKEN = "place your API token here"

def fetch_discogs_release_data(release_id):
    url = f"https://api.discogs.com/releases/{release_id}"
    headers = {
        "Authorization": f"Discogs token={DISCOGS_TOKEN}",
        "User-Agent": "MyDiscogsApp/1.0"
    }
    response = requests.get(url, headers=headers)

    # If we got rate-limited or need to handle delays
    if response.status_code == 429:
        # We hit the limit, so wait a full 60s before trying again
        print("Hit rate limit. Waiting 60 seconds before retrying...")
        time.sleep(60)
        response = requests.get(url, headers=headers)

    response.raise_for_status()
    # Return both JSON and headers so we can track rate limits
    return response.json(), response.headers

def download_image(image_url, output_path):
    headers = {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://www.discogs.com/"
    }
    img_response = requests.get(image_url, headers=headers, stream=True)
    img_response.raise_for_status()
    with open(output_path, 'wb') as f:
        for chunk in img_response.iter_content(chunk_size=8192):
            f.write(chunk)

def main(csv_file_path):
    base_dir = os.path.dirname(os.path.abspath(csv_file_path))
    imgs_dir = os.path.join(base_dir, "imgs")

    if not os.path.exists(imgs_dir):
        os.makedirs(imgs_dir)

    with open(csv_file_path, "r", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)

        for row in reader:
            release_id = row.get('release_id')
            if not release_id:
                print("No release_id found in row, skipping:", row)
                continue

            output_path = os.path.join(imgs_dir, f"{release_id}.jpg")
            if os.path.exists(output_path):
                print(f"Image for release_id {release_id} already exists, skipping.")
                continue

            try:
                discogs_data, headers = fetch_discogs_release_data(release_id)
                images = discogs_data.get('images', [])
                if not images:
                    print(f"No images found for release_id {release_id}")
                else:
                    image_url = images[0].get('uri') or images[0].get('uri150')
                    if image_url:
                        download_image(image_url, output_path)
                        print(f"Downloaded image for release_id {release_id} -> {output_path}")
                    else:
                        print(f"No suitable image URL found for release_id {release_id}")

                # Rate limit info
                rate_limit = int(headers.get("X-Discogs-Ratelimit", 60))
                rate_used = int(headers.get("X-Discogs-Ratelimit-Used", 0))
                rate_remaining = int(headers.get("X-Discogs-Ratelimit-Remaining", rate_limit - rate_used))

                # If we are running low on requests, slow down
                # Example: if less than 5 requests remain, sleep a bit longer
                if rate_remaining < 5:
                    # Sleep to let the window refresh
                    # Each request consumes 1 slot, so if you have few left,
                    # you might wait a fraction of the 60s window to spread requests out.
                    print(f"Low on requests (Remaining: {rate_remaining}). Sleeping a bit...")
                    time.sleep(10)  # Sleep 10 seconds when running low

            except requests.HTTPError as http_err:
                print(f"HTTP error for release_id {release_id}: {http_err}")
            except Exception as e:
                print(f"Error processing release_id {release_id}: {e}")

            # General small delay to avoid using all requests instantly
            time.sleep(2)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python download_discogs_images.py path/to/your_collection.csv")
        sys.exit(1)

    csv_file = sys.argv[1]
    main(csv_file)

