import ORM from 'sequelize'
const { Sequelize, DataTypes, Model } = ORM;
/**
 * A database entity model that represents contents in the database.
 * This model is specifically designed for users
 * @see "https://sequelize.org/master/manual/model-basics.html#taking-advantage-of-models-being-classes"
**/
import date from 'date-and-time';
const now = new Date();
const DateNow = date.format(now, 'MM DD, YYYY HH:mm:ss');
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
                type: DataTypes.DATE(), allowNull: true, defaultValue: DateNow
            },
            "dateUpdated": { type: DataTypes.DATE(), allowNull: true, defaultValue: DateNow },
            "date": { type: DataTypes.DATEONLY(), allowNull: true },
            "time": { type: DataTypes.ENUM('09am to 11.45am', '12pm to 02.45pm', '03pm to 05.45pm', '06pm to 08.45pm', '09pm to 11.45pm'), allowNull: true },
            "choice": { type: DataTypes.ENUM("Karaoke", "Movie"), defaultValue: null },
            "user_id": { type: DataTypes.CHAR(36), allowNull: true, defaultValue: null },
            "room_id": { type: DataTypes.CHAR(36), allowNull: true, defaultValue: null }
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