#!/usr/bin/env python3
"""
Startup script for Finno App Mobile Demo
"""

import subprocess
import sys
import os

def install_requirements():
    """Install required packages"""
    print("Installing requirements...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✓ Requirements installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ Failed to install requirements: {e}")
        return False

def start_app():
    """Start the Flask app"""
    print("Starting Finno App Mobile Demo...")
    print("=" * 50)
    print("🚀 Finno App - Tài chính Cá nhân AI")
    print("=" * 50)
    print("📱 Mobile App Interface: http://localhost:5000")
    print("🔧 API Endpoints: http://localhost:5000/api/")
    print("=" * 50)
    print("Press Ctrl+C to stop the server")
    print("=" * 50)
    
    try:
        subprocess.run([sys.executable, "app.py"])
    except KeyboardInterrupt:
        print("\n👋 Finno App stopped. Goodbye!")

def main():
    """Main function"""
    print("Finno App Mobile Demo Setup")
    print("=" * 30)
    
    # Check if we're in the right directory
    if not os.path.exists("app.py"):
        print("✗ Error: app.py not found. Please run this script from the project directory.")
        return
    
    # Install requirements
    if not install_requirements():
        return
    
    # Start the app
    start_app()

if __name__ == "__main__":
    main()

