import { Sequelize } from 'sequelize';
import { User } from '../models/User';
import { Post } from '../models/Post';

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST || 'mysql_db',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_DATABASE || 'microservices',
    logging: false,
});

// Initialize models
User.initModel(sequelize);
Post.initModel(sequelize);

// Setup associations
User.associate();
Post.associate();

export { sequelize };
