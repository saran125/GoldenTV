import ORM from 'sequelize'
const { Sequelize, DataTypes, Model } = ORM;
/**
 * A database entity model that represents contents in the database.
 * This model is specifically designed for users
 * @see "https://sequelize.org/master/manual/model-basics.html#taking-advantage-of-models-being-classes"
**/

export class Modelticket extends Model {
    /**
     * Initializer of the model
     * @see Model.init
     * @access public
     * @param {Sequelize} database The configured Sequelize handle
    **/
    static initialize(database) {
        Modelticket.init({
            "ticket_id": { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4 },
            "dateCreated": {
                type: DataTypes.DATE(), allowNull: true, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            "dateUpdated": { type: DataTypes.DATE(), allowNull: true, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
            "date": { type: DataTypes.DATEONLY(), allowNull: true },
            "time": { type: DataTypes.ENUM('9am to 11.45am', '12pm to 2.45pm', '3pm to 5.45pm', '6pm to 8.45pm', '9pm to 11.45pm'), allowNull: true },
            "choice": { type: DataTypes.ENUM("Song", "Movie"), defaultValue: null },
            "user_id": { type: DataTypes.CHAR(36), allowNull: true, defaultValue: null },
            "roomtype": { type: DataTypes.CHAR(36), allowNull: true, defaultValue: null }
        }, {
            "sequelize": database,
            "modelName": "ticket",
            "hooks": {
                "afterUpdate": Modelticket._auto_update_optionstamp
            }
        });
    }

    /**
     * Emulates "TRIGGER" of "AFTER UPDATE" in most SQL databases.
     * This function simply assist to update the 'dateUpdated' optionstamp.
     * @private
     * @param {Modelticket}     instance The entity model to be updated
     * @param {UpdateOptions} options  Additional options of update propagated from the initial call
    **/
    static _auto_update_optionstamp(instance, options) {
        // @ts-ignore
        instance.dateUpdated = Sequelize.literal('CURRENT_TIMESTAMP');
    }
    get date() { return this.getDataValue("date"); }
    get time() { return this.getDataValue("time"); }
}