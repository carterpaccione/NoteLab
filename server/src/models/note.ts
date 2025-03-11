import { DataTypes, Sequelize, Model, Optional } from "sequelize";

export enum ImportanceLevel {
    MAIN = "Main",
    HIGHLIGHT = "Highlight",
    STICKY = "Sticky",
}

interface NoteAttributes {
    id: number;
    content: string;
    notebook_id: number;
    importance?: ImportanceLevel;
    createdAt?: Date;
}

interface NoteCreationAttributes extends Optional<NoteAttributes, "id"> { }

export class Note
    extends Model<NoteAttributes, NoteCreationAttributes>
    implements NoteAttributes {
    public id!: number;
    public content!: string;
    public notebook_id!: number;
    public importance?: ImportanceLevel;
}

export function NoteFactory(sequelize: Sequelize): typeof Note {
    Note.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            notebook_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            importance: {
                type: DataTypes.ENUM(
                    ImportanceLevel.MAIN,
                    ImportanceLevel.HIGHLIGHT,
                    ImportanceLevel.STICKY),
                allowNull: false,
                defaultValue: ImportanceLevel.MAIN,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
        },
        {
            tableName: "notes",
            sequelize,
        }
    );
    
    return Note;
}