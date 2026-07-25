import os
import sys
from getpass import getpass
from database import supabase
from auth_utils import get_password_hash

def main():
    print("=== Create Admin Account ===")
    name = input("Admin Name: ").strip()
    email = input("Admin Email: ").strip()
    enrollment = input("Admin ID / Enrollment Number: ").strip()
    password = getpass("Admin Password: ").strip()

    if not name or not email or not enrollment or not password:
        print("All fields are required!")
        sys.exit(1)

    # Check if exists
    res = supabase.table("admins").select("*").eq("email", email).execute()
    if res.data:
        print("Error: Admin email already registered.")
        sys.exit(1)

    hashed_pw = get_password_hash(password)
    new_admin = {
        "email": email,
        "enrollment_number": enrollment,
        "password_hash": hashed_pw,
        "name": name,
    }

    try:
        data = supabase.table("admins").insert(new_admin).execute()
        print(f"Success! Admin '{name}' created successfully.")
    except Exception as e:
        print(f"Failed to create admin: {e}")

if __name__ == "__main__":
    main()
