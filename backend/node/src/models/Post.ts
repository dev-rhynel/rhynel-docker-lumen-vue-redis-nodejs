import { Model, DataTypes, Sequelize } from 'sequelize';
import { User } from './User';

interface PostAttributes {
    id?: number;
    title: string;
    content: string;
    userId: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Post extends Model<PostAttributes> {
    public id!: number;
    public title!: string;
    public content!: string;
    public userId!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static initModel(sequelize: Sequelize): void {
        Post.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: User,
                    key: 'id',
                },
            },
        }, {
            sequelize,
            tableName: 'posts',
            modelName: 'Post',
        });
    }

    static associate(): void {
        Post.belongsTo(User, {
            foreignKey: 'userId',
            as: 'user',
        });
    }
}
