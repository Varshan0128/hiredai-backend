#!/usr/bin/env python3
"""
Simple script to help set up environment variables for the backend.
Run this from the backend directory.
"""

import os

def setup_environment():
    print("🔧 Backend Environment Setup")
    print("=" * 40)
    
    # Get Supabase URL from the frontend config
    SUPABASE_URL = "https://gcioedwsnxomfjiqsitd.supabase.co"
    
    print(f"Supabase URL: {SUPABASE_URL}")
    print("\nTo complete setup:")
    print("1. Go to your Supabase Dashboard")
    print("2. Navigate to Settings -> API")
    print("3. Copy your 'service_role' key (NOT the anon key)")
    print("4. Set the environment variable:")
    print(f"   export SUPABASE_SERVICE_ROLE=your-service-role-key-here")
    print("\nOr create a .env file in this directory with:")
    print(f"SUPABASE_URL={SUPABASE_URL}")
    print("SUPABASE_SERVICE_ROLE=your-service-role-key-here")
    
    # Check current env
    current_url = os.environ.get('SUPABASE_URL')
    current_service_role = os.environ.get('SUPABASE_SERVICE_ROLE')
    
    print(f"\nCurrent environment status:")
    print(f"SUPABASE_URL: {'✅ Set' if current_url else '❌ Missing'}")
    print(f"SUPABASE_SERVICE_ROLE: {'✅ Set' if current_service_role else '❌ Missing'}")
    
    if not current_url or not current_service_role:
        print(f"\n⚠️  Environment variables not set. Backend signup will fall back to regular signup.")
    else:
        print(f"\n✅ Environment variables are set! Backend signup should work.")

if __name__ == "__main__":
    setup_environment()
