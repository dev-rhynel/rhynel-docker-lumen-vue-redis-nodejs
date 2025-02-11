CREATE DATABASE IF NOT EXISTS lumen_db;
USE lumen_db;

-- Grant privileges
GRANT ALL PRIVILEGES ON lumen_db.* TO 'root'@'%' IDENTIFIED BY '1265';
FLUSH PRIVILEGES;
