import { DataTypes, Sequelize, Model, Optional } from "sequelize";

interface NotebookAttributes {
    id: number;
    title: string;
    user_id: number;
    createdAt?: Date;
}

interface NotebookCreationAttributes extends Optional<NotebookAttributes, "id"> {}

export class Notebook
    extends Model<NotebookAttributes, NotebookCreationAttributes>
    implements NotebookAttributes
{
    public id!: number;
    public title!: string;
    public user_id!: number;
    public readonly createdAt!: Date;
}

export function NotebookFactory(sequelize: Sequelize): typeof Notebook {
    Notebook.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: "notebooks",
            sequelize,
        }
    );
    
    return Notebook;
}