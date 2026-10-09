import json
import os
import re
import urllib.request
import time
from pathlib import Path

def sync():
    # Paths
    # Ensure paths are correct relative to the root
    root = Path(__file__).resolve().parent.parent
    config_path = root / 'my-data/config.js'
    data_path = root / 'my-data/portfolio_data.json'
    
    if not os.path.exists(config_path):
        print(f"Error: {config_path} not found.")
        return

    # 1. Get Username from config.js
    with open(config_path, 'r', encoding='utf-8') as f:
        config_content = f.read()
    username_match = re.search(r"githubUsername:\s*['\"]([^'\"]+)['\"]", config_content)
    if not username_match:
        print("Error: Could not find githubUsername in config.js")
        return
    username = username_match.group(1)
    print(f"Syncing projects for GitHub user: {username}...")
    
    # 2. Fetch Repos from GitHub
    url = f"https://api.github.com/users/{username}/repos?sort=updated"
    headers = {'User-Agent': 'Mozilla/5.0'} # Required by GitHub API
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as response:
            repos = json.loads(response.read().decode())
    except Exception as e:
        print(f"Error fetching repos from GitHub: {e}")
        return
    
    # 3. Load existing data
    if os.path.exists(data_path):
        with open(data_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    else:
        data = {"bio": {}, "experience": [], "projects": [], "certs": []}
    
    if 'projects' not in data:
        data['projects'] = []
        
    existing_links = [p['link'] for p in data.get('projects', []) if p.get('link')]
    
    # 4. Add new projects
    added_count = 0
    for repo in repos:
        # Skip forked repositories to focus on original work
        if repo.get('fork'):
            continue
            
        html_url = repo.get('html_url')
        
        # Check if already exists (check for substring match to handle README.md links)
        already_exists = False
        for existing in existing_links:
            if html_url.lower() in existing.lower() or existing.lower() in html_url.lower():
                already_exists = True
                break
        
        if already_exists:
            continue
            
        new_project = {
            "id": str(int(time.time() * 1000) + added_count), # Using string ID as in portfolio_data.json
            "title": repo.get('name').replace('-', ' ').replace('_', ' ').upper(),
            "link": html_url,
            "img": "",
            "learned": repo.get('description') or "Automatically imported from GitHub.",
            "skills": repo.get('language') or "Other"
        }
        data['projects'].append(new_project)
        added_count += 1
        print(f"Added: {new_project['title']}")
        
    # 5. Save updated data
    if added_count > 0:
        with open(data_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        print(f"Successfully added {added_count} new projects to {data_path}.")
    else:
        print("No new projects found on GitHub to import.")

if __name__ == "__main__":
    sync()

