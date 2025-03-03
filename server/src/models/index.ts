import sequelize from "../config/connection.js";
import { UserFactory } from "./user.js";
import { NotebookFactory } from "./notebook.js";
import { NoteFactory } from "./note.js";

const User = UserFactory(sequelize);
const Notebook = NotebookFactory(sequelize);
const Note = NoteFactory(sequelize);

User.hasMany(Notebook, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
});
Notebook.belongsTo(User, { foreignKey: "user_id" });

Notebook.hasMany(Note, {
    foreignKey: "notebook_id",
    onDelete: "CASCADE"
});
Note.belongsTo(Notebook, { foreignKey: "notebook_id" });

export { User, Notebook, Note };
