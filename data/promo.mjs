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
export class Modelpromo extends Model {
    /**
     * Initializer of the model
     * @see Model.init
     * @access public
     * @param {Sequelize} database The configured Sequelize handle
    **/
    static initialize(database) {
        Modelpromo.init({
            "promo_id": { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4 },
            "dateCreated": {
                type: DataTypes.DATE(), allowNull: true, defaultValue: DateNow
            },
            "dateUpdated": { type: DataTypes.DATE(), allowNull: true, defaultValue: DateNow },
            "discount": { type: DataTypes.INTEGER(), allowNull: true },
            "promo_code": { type: DataTypes.STRING(650), allowNull: true },
            "roomsize": { type: DataTypes.ENUM('Small', 'Medium', 'Large'), allowNull: true },
        }, {
            "sequelize": database,
            "modelName": "promo",
            "hooks": {
                "afterUpdate": Modelpromo._auto_update_optionstamp
            }
        });
    }
    /**
     * Emulates "TRIGGER" of "AFTER UPDATE" in most SQL databases.
     * This function simply assist to update the 'dateUpdated' optionstamp.
     * @private
     * @param {Modelpromo}     instance The entity model to be updated
     * @param {UpdateOptions} options  Additional options of update propagated from the initial call
    **/
}