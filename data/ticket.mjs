import ORM from 'sequelize'
const { Sequelize, DataTypes, Model } = ORM;

/**
 * For enumeration use
**/
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
            "uuid": { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4 },
            "dateCreated": { type: DataTypes.DATE(), allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
            "dateUpdated": { type: DataTypes.DATE(), allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
            "choice": { type: DataTypes.STRING(128) },
            "roomtype_id": { type: DataTypes.CHAR(36), foreignKey: true, allowNull: true, defaultValue: '0000-0000-0000-0000'},
            "ref": { type: DataTypes.CHAR(8), allowNull:false},
            "user_id": { type: DataTypes.CHAR(36), foreignKey:true, allowNull: false, defaultValue: '0000-0000-0000-0000'}
        }, {
            "sequelize": database,
            "modelName": "ticket",
            "hooks": {
                "afterUpdate": Modelticket._auto_update_timestamp
            }
        });
    }
    /**
     * Emulates "TRIGGER" of "AFTER UPDATE" in most SQL databases.
     * This function simply assist to update the 'dateUpdated' timestamp.
     * @private
     * @param {Modelticket}     instance The entity model to be updated
     * @param {UpdateOptions} options  Additional options of update propagated from the initial call
    **/
    static _auto_update_timestamp(instance, options) {
        // @ts-ignore
        instance.dateUpdated = Sequelize.literal('CURRENT_TIMESTAMP');
    }
    get choice() { return this.getDataValue("choice"); }
    get location() { return this.getDataValue("location"); }
    get date() { return this.getDataValue("date"); }
    get time() { return this.getDataValue("time"); }
    get roomtype() { return this.getDataValue("roomtype"); }
    
}