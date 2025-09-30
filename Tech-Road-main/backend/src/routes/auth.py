#!/usr/bin/python3
"""
Authentication routes for Tech-Road API
Handles user registration, login, and JWT token management
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity, create_refresh_token, get_jwt
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
import bcrypt
import os
from datetime import datetime, timedelta
import re

# Load environment variables
load_dotenv()

# Create blueprint
auth_bp = Blueprint('auth', __name__)

# MongoDB connection
client = MongoClient(os.getenv("MONGODB_URI", "mongodb://localhost:27017/techroad"))
db = client["techroad"]

# JWT Configuration
JWT_SECRET_KEY = os.getenv('JWT_SECRET', 'your-super-secret-jwt-key-change-in-production')
JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)

# Blacklisted tokens (in production, use Redis or database)
blacklisted_tokens = set()

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """Validate password strength"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not re.search(r'[A-Za-z]', password):
        return False, "Password must contain at least one letter"
    if not re.search(r'\d', password):
        return False, "Password must contain at least one number"
    return True, "Password is valid"

def hash_password(password):
    """Hash password using bcrypt"""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt)

def check_password(password, hashed_password):
    """Check if password matches hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['email', 'password', 'user_type']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'{field} is required'}), 400
        
        email = data['email'].lower().strip()
        password = data['password']
        user_type = data['user_type']
        
        # Validate email format
        if not validate_email(email):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Validate password strength
        is_valid, message = validate_password(password)
        if not is_valid:
            return jsonify({'error': message}), 400
        
        # Validate user type
        if user_type not in ['student', 'professional', 'career_changer']:
            return jsonify({'error': 'Invalid user type. Must be student, professional, or career_changer'}), 400
        
        # Check if user already exists
        existing_user = db.users.find_one({'email': email})
        if existing_user:
            return jsonify({'error': 'User with this email already exists'}), 409
        
        # Hash password
        password_hash = hash_password(password)
        
        # Create user profile structure
        profile_data = data.get('profile', {})
        default_profile = {
            'education': profile_data.get('education', ''),
            'experience_level': profile_data.get('experience_level', 'basic'),
            'learning_preferences': profile_data.get('learning_preferences', []),
            'career_goals': {
                'work_environment': profile_data.get('career_goals', {}).get('work_environment', ''),
                'income_expectations': profile_data.get('career_goals', {}).get('income_expectations', 0)
            },
            'time_commitment': profile_data.get('time_commitment', 5)
        }
        
        # Create new user
        new_user = {
            'email': email,
            'password_hash': password_hash,
            'user_type': user_type,
            'profile': default_profile,
            'created_at': datetime.utcnow(),
            'last_login': None,
            'is_active': True
        }
        
        # Insert user into database
        result = db.users.insert_one(new_user)
        
        # Create tokens
        access_token = create_access_token(
            identity=str(result.inserted_id),
            expires_delta=JWT_ACCESS_TOKEN_EXPIRES
        )
        refresh_token = create_refresh_token(
            identity=str(result.inserted_id),
            expires_delta=JWT_REFRESH_TOKEN_EXPIRES
        )
        
        # Update last login
        db.users.update_one(
            {'_id': result.inserted_id},
            {'$set': {'last_login': datetime.utcnow()}}
        )
        
        # Return success response
        return jsonify({
            'message': 'User registered successfully',
            'user': {
                'id': str(result.inserted_id),
                'email': email,
                'user_type': user_type,
                'profile': default_profile
            },
            'access_token': access_token,
            'refresh_token': refresh_token,
            'token_type': 'Bearer'
        }), 201
        
    except Exception as e:
        return jsonify({'error': f'Registration failed: {str(e)}'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({'error': 'Email and password are required'}), 400
        
        email = data['email'].lower().strip()
        password = data['password']
        
        # Find user by email
        user = db.users.find_one({'email': email})
        if not user:
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Check if user is active
        if not user.get('is_active', True):
            return jsonify({'error': 'Account is deactivated'}), 401
        
        # Verify password
        if not check_password(password, user['password_hash']):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Create tokens
        user_id = str(user['_id'])
        access_token = create_access_token(
            identity=user_id,
            expires_delta=JWT_ACCESS_TOKEN_EXPIRES
        )
        refresh_token = create_refresh_token(
            identity=user_id,
            expires_delta=JWT_REFRESH_TOKEN_EXPIRES
        )
        
        # Update last login
        db.users.update_one(
            {'_id': user['_id']},
            {'$set': {'last_login': datetime.utcnow()}}
        )
        
        # Return success response
        return jsonify({
            'message': 'Login successful',
            'user': {
                'id': user_id,
                'email': user['email'],
                'user_type': user['user_type'],
                'profile': user.get('profile', {})
            },
            'access_token': access_token,
            'refresh_token': refresh_token,
            'token_type': 'Bearer'
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Login failed: {str(e)}'}), 500

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token using refresh token"""
    try:
        current_user_id = get_jwt_identity()
        
        # Verify user still exists and is active
        user = db.users.find_one({'_id': ObjectId(current_user_id)})
        if not user or not user.get('is_active', True):
            return jsonify({'error': 'User not found or inactive'}), 401
        
        # Create new access token
        new_access_token = create_access_token(
            identity=current_user_id,
            expires_delta=JWT_ACCESS_TOKEN_EXPIRES
        )
        
        return jsonify({
            'message': 'Token refreshed successfully',
            'access_token': new_access_token,
            'token_type': 'Bearer'
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Token refresh failed: {str(e)}'}), 500

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout user by blacklisting the token"""
    try:
        jti = get_jwt()['jti']  # JWT ID
        blacklisted_tokens.add(jti)
        
        return jsonify({'message': 'Successfully logged out'}), 200
        
    except Exception as e:
        return jsonify({'error': f'Logout failed: {str(e)}'}), 500

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user profile"""
    try:
        current_user_id = get_jwt_identity()
        
        # Find user
        user = db.users.find_one({'_id': ObjectId(current_user_id)})
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Return user profile
        return jsonify({
            'user': {
                'id': str(user['_id']),
                'email': user['email'],
                'user_type': user['user_type'],
                'profile': user.get('profile', {}),
                'created_at': user['created_at'].isoformat() if user.get('created_at') else None,
                'last_login': user['last_login'].isoformat() if user.get('last_login') else None
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get profile: {str(e)}'}), 500

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update user profile"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Prepare update data
        update_data = {}
        
        # Update profile fields
        if 'profile' in data:
            profile_data = data['profile']
            update_fields = {
                'profile.education': profile_data.get('education'),
                'profile.experience_level': profile_data.get('experience_level'),
                'profile.learning_preferences': profile_data.get('learning_preferences'),
                'profile.time_commitment': profile_data.get('time_commitment')
            }
            
            # Handle career goals
            if 'career_goals' in profile_data:
                career_goals = profile_data['career_goals']
                update_fields['profile.career_goals.work_environment'] = career_goals.get('work_environment')
                update_fields['profile.career_goals.income_expectations'] = career_goals.get('income_expectations')
            
            # Only add non-None values
            for key, value in update_fields.items():
                if value is not None:
                    update_data[key] = value
        
        if not update_data:
            return jsonify({'error': 'No valid fields to update'}), 400
        
        # Update user
        result = db.users.update_one(
            {'_id': ObjectId(current_user_id)},
            {'$set': update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({'error': 'User not found'}), 404
        
        # Get updated user
        updated_user = db.users.find_one({'_id': ObjectId(current_user_id)})
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': {
                'id': str(updated_user['_id']),
                'email': updated_user['email'],
                'user_type': updated_user['user_type'],
                'profile': updated_user.get('profile', {})
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to update profile: {str(e)}'}), 500

@auth_bp.route('/verify-token', methods=['GET'])
@jwt_required()
def verify_token():
    """Verify if the current token is valid"""
    try:
        current_user_id = get_jwt_identity()
        
        # Check if user exists and is active
        user = db.users.find_one({'_id': ObjectId(current_user_id)})
        if not user or not user.get('is_active', True):
            return jsonify({'error': 'Invalid or inactive user'}), 401
        
        return jsonify({
            'message': 'Token is valid',
            'user_id': current_user_id,
            'user_type': user['user_type']
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Token verification failed: {str(e)}'}), 500

# JWT token blacklist checker
def check_if_token_revoked(jwt_header, jwt_payload):
    """Check if token is blacklisted"""
    jti = jwt_payload['jti']
    return jti in blacklisted_tokens
