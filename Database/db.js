const { Sequelize, Op } = require('sequelize')

const db = new Sequelize({
    dialect: 'sqlite',
    storage: __dirname + '/test.db',
  });

  // MODEL 1 - Tasks { Id: Integer , Title: String , Description: text, DueDate: DateOnly, Status: ENUM,
  //  Priority: Enum }
  const Tasks = db.define('Task', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: Sequelize.STRING(40),
      allowNull: false,
      required:true
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    dueDate: {
        type: Sequelize.DATEONLY(),
        allowNull: false,
        required:true,
        defaultValue: Sequelize.NOW()
    },
    status: {
        type: Sequelize.ENUM(),
        values: ('incomplete','completed'),
        defaultValue:'incomplete',
        allowNull: false
    },
    priority: {
        type: Sequelize.ENUM(),
        values: ('High', 'Medium','Low'),
        defaultValue:'Medium',
        allowNull: false
      }
    
  });
  
  // MODEL 2 - Notes { Id: Integer, Note:text, TaskId }

  const Notes = db.define('Notes', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    note:{
        type: Sequelize.TEXT,
        required:true,
        allowNull:false
    }
});

//Association One to Many(Task to Notes)
Tasks.Notes=Tasks.hasMany(Notes,{
    as:'notes',
    onDelete: 'cascade', 
    foreignKey: { allowNull: false }, 
    hooks: true
  });


db.sync()

module.exports = {
    db, Tasks, Notes
}
