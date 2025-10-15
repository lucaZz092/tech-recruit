// MongoDB initialization script
db = db.getSiblingDB('tech-recruit');

// Create user for the application
db.createUser({
  user: 'app_user',
  pwd: 'app_password',
  roles: [
    {
      role: 'readWrite',
      db: 'tech-recruit'
    }
  ]
});

print('Database initialized successfully');
