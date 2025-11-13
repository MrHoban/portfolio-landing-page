from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import os
from dotenv import load_dotenv
import requests
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from datetime import datetime
import json
import feedparser
import re

# Load .env file from the backend directory
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(env_path)

app = Flask(__name__)

# CORS configuration - allow frontend domains
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')
# Allow CORS from common hosting platforms and localhost
allowed_origins = [
    FRONTEND_URL,
    "http://localhost:3000",
    "https://*.vercel.app",
    "https://*.netlify.app",
    "https://*.github.io"
]
# For production, you can set ALLOW_ALL_ORIGINS=true in env for flexibility
if os.getenv('ALLOW_ALL_ORIGINS', 'false').lower() == 'true':
    CORS(app, resources={r"/api/*": {"origins": "*"}})
else:
    CORS(app, resources={
        r"/api/*": {
            "origins": "*",  # Allow all for portfolio (public API)
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type"]
        }
    })

# MongoDB connection (optional)
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
DB_NAME = os.getenv('DB_NAME', 'portfolio_db')

# Remove quotes if present (common issue with .env files)
MONGO_URI = MONGO_URI.strip('"').strip("'")

db = None
try:
    # Check if using MongoDB Atlas (mongodb+srv://)
    if MONGO_URI.startswith('mongodb+srv://'):
        # Use ServerApi for Atlas connections
        client = MongoClient(MONGO_URI, server_api=ServerApi('1'), serverSelectionTimeoutMS=10000)
    else:
        # Use standard connection for local MongoDB
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
    
    # Test connection
    client.admin.command('ping')
    db = client[DB_NAME]
    print("✓ MongoDB connected successfully")
    print(f"✓ Using database: {DB_NAME}")
except Exception as e:
    print(f"⚠ MongoDB connection failed: {str(e)}")
    print(f"⚠ Connection string: {MONGO_URI[:50]}...")  # Show first 50 chars for debugging
    print("⚠ Continuing without MongoDB (caching and contact storage disabled)")
    db = None

# GitHub configuration
GITHUB_USERNAME = os.getenv('GITHUB_USERNAME', '')
GITHUB_TOKEN = os.getenv('GITHUB_TOKEN', '')

# Medium configuration
MEDIUM_USERNAME = os.getenv('MEDIUM_USERNAME', '')

@app.route('/api/repos', methods=['GET'])
def get_repos():
    """Fetch GitHub repositories"""
    try:
        # Check if repos are cached in MongoDB (if available)
        if db is not None:
            try:
                cached_repos = db.repos.find_one({'username': GITHUB_USERNAME})
                
                if cached_repos and cached_repos.get('updated_at'):
                    updated_at = cached_repos.get('updated_at')
                    # Handle both datetime objects and strings
                    if not isinstance(updated_at, datetime):
                        from dateutil import parser
                        updated_at = parser.parse(str(updated_at))
                    time_diff = (datetime.now() - updated_at).total_seconds()
                    if time_diff < 3600:  # Less than 1 hour old
                        return jsonify(cached_repos.get('repos', []))
            except Exception as e:
                print(f"MongoDB cache check failed: {str(e)}")
        
        # Fetch from GitHub API
        if not GITHUB_USERNAME:
            return jsonify({'error': 'GitHub username not configured. Please set GITHUB_USERNAME in .env file'}), 400
        
        headers = {}
        if GITHUB_TOKEN:
            headers['Authorization'] = f'token {GITHUB_TOKEN}'
        
        url = f'https://api.github.com/users/{GITHUB_USERNAME}/repos'
        params = {
            'sort': 'updated',
            'direction': 'desc',
            'per_page': 12
        }
        
        response = requests.get(url, headers=headers, params=params)
        
        if response.status_code == 200:
            repos = response.json()
            # Store in MongoDB (if available)
            if db is not None:
                try:
                    db.repos.update_one(
                        {'username': GITHUB_USERNAME},
                        {
                            '$set': {
                                'repos': repos,
                                'updated_at': datetime.now()
                            }
                        },
                        upsert=True
                    )
                except Exception as e:
                    print(f"MongoDB cache save failed: {str(e)}")
            return jsonify(repos)
        elif response.status_code == 404:
            return jsonify({'error': f'GitHub user "{GITHUB_USERNAME}" not found'}), 404
        else:
            return jsonify({'error': f'Failed to fetch repositories: {response.status_code}'}), response.status_code
            
    except Exception as e:
        print(f"Error fetching repos: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/resume', methods=['GET'])
def get_resume():
    """Download resume PDF"""
    try:
        resume_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'RESUME-2025.pdf')
        if os.path.exists(resume_path):
            return send_file(resume_path, as_attachment=True, download_name='RESUME-2025.pdf')
        else:
            return jsonify({'error': 'Resume not found'}), 404
    except Exception as e:
        print(f"Error serving resume: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/contact', methods=['POST'])
def submit_contact():
    """Handle contact form submissions"""
    try:
        data = request.json
        
        if db is not None:
            # Store in MongoDB if available
            contact_entry = {
                'name': data.get('name'),
                'email': data.get('email'),
                'message': data.get('message'),
                'created_at': datetime.now()
            }
            
            db.contacts.insert_one(contact_entry)
            return jsonify({'message': 'Contact form submitted successfully'}), 200
        else:
            # MongoDB not available - just log it
            print(f"Contact form submission (MongoDB not available):")
            print(f"  Name: {data.get('name')}")
            print(f"  Email: {data.get('email')}")
            print(f"  Message: {data.get('message')}")
            return jsonify({
                'message': 'Contact form submitted (not stored - MongoDB not available)',
                'warning': 'MongoDB is not running. Install MongoDB to store contact submissions.'
            }), 200
        
    except Exception as e:
        print(f"Error submitting contact: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/blog', methods=['GET'])
def get_blog_posts():
    """Fetch Medium blog posts"""
    try:
        # Check if posts are cached in MongoDB (if available)
        if db is not None:
            try:
                cached_posts = db.blog_posts.find_one({'username': MEDIUM_USERNAME})
                
                if cached_posts and cached_posts.get('updated_at'):
                    updated_at = cached_posts.get('updated_at')
                    # Handle both datetime objects and strings
                    if not isinstance(updated_at, datetime):
                        from dateutil import parser
                        updated_at = parser.parse(str(updated_at))
                    time_diff = (datetime.now() - updated_at).total_seconds()
                    if time_diff < 3600:  # Less than 1 hour old
                        return jsonify(cached_posts.get('posts', []))
            except Exception as e:
                print(f"MongoDB cache check failed: {str(e)}")
        
        # Fetch from Medium RSS feed
        if not MEDIUM_USERNAME:
            return jsonify({'error': 'Medium username not configured. Please set MEDIUM_USERNAME in .env file'}), 400
        
        # Medium RSS feed URL
        rss_url = f'https://medium.com/feed/@{MEDIUM_USERNAME}'
        
        # Parse RSS feed
        feed = feedparser.parse(rss_url)
        
        if feed.bozo and feed.bozo_exception:
            return jsonify({'error': f'Failed to parse Medium RSS feed: {str(feed.bozo_exception)}'}), 500
        
        posts = []
        for entry in feed.entries[:12]:  # Limit to 12 most recent posts
            # Extract image from content
            image_url = None
            if 'content' in entry:
                # Try to find image in content
                img_match = re.search(r'<img[^>]+src="([^"]+)"', entry.content[0].value if isinstance(entry.content, list) else entry.content.value)
                if img_match:
                    image_url = img_match.group(1)
            
            # Extract description (strip HTML tags)
            description = ''
            if 'summary' in entry:
                description = re.sub(r'<[^>]+>', '', entry.summary)
                description = description.strip()[:200]  # Limit to 200 chars
            
            post = {
                'title': entry.title,
                'link': entry.link,
                'published': entry.published if 'published' in entry else '',
                'description': description,
                'image': image_url,
                'author': entry.author if 'author' in entry else MEDIUM_USERNAME
            }
            posts.append(post)
        
        # Store in MongoDB (if available)
        if db is not None:
            try:
                db.blog_posts.update_one(
                    {'username': MEDIUM_USERNAME},
                    {
                        '$set': {
                            'posts': posts,
                            'updated_at': datetime.now()
                        }
                    },
                    upsert=True
                )
            except Exception as e:
                print(f"MongoDB cache save failed: {str(e)}")
        
        return jsonify(posts)
        
    except Exception as e:
        print(f"Error fetching blog posts: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    import signal
    import sys
    
    port = int(os.getenv('PORT', 5000))
    
    def signal_handler(sig, frame):
        print('\n\n✓ Shutting down server gracefully...')
        if db is not None:
            try:
                client.close()
                print('✓ MongoDB connection closed')
            except:
                pass
        sys.exit(0)
    
    # Register signal handler for graceful shutdown
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    try:
        app.run(debug=True, host='0.0.0.0', port=port, use_reloader=False)
    except KeyboardInterrupt:
        print('\n\n✓ Server stopped')
        if db is not None:
            try:
                client.close()
            except:
                pass

