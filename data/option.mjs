import ORM from 'sequelize'
const { Sequelize, DataTypes, Model } = ORM;
import  moment  from 'moment';

/**
 * A database entity model that represents contents in the database.
 * This model is specifically designed for users
 * @see "https://sequelize.org/master/manual/model-basics.html#taking-advantage-of-models-being-classes"
**/
export class Modeloption extends Model {
	/**
	 * Initializer of the model
	 * @see Model.init
	 * @access public
	 * @param {Sequelize} database The configured Sequelize handle
	**/
	static initialize(database) {
		Modeloption.init({
			"uuid"       : { type: DataTypes.CHAR(36),    foreignKey: true, defaultValue: DataTypes.UUIDV4 },
			"dateCreated": {
				type: DataTypes.DATE(), allowNull: true, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')},
			"dateUpdated": {
				type: DataTypes.DATE(), allowNull: true, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')},
			"location"   : { type: DataTypes.STRING(600), allowNull: true, defaultValue:null},
			"date": {
				type: DataTypes.DATEONLY(), allowNull: false},
				"time":{
					type: DataTypes.STRING(100), allowNull: false
				},
			"small": { type: DataTypes.INTEGER(), allowNull: false  },
			"medium": { type: DataTypes.INTEGER(), allowNull: false },
			"large": { type: DataTypes.INTEGER(), allowNull: false},
			"uuid": { type: DataTypes.CHAR(36), foreignKey: true, defaultValue: "00000000-0000-0000-0000-000000000000"}
        }, {
			"sequelize": database,
			"modelName": "option",
			"hooks"    : {
				"afterUpdate": Modeloption._auto_update_optionstamp
			}
		});
	}

	/**
	 * Emulates "TRIGGER" of "AFTER UPDATE" in most SQL databases.
	 * This function simply assist to update the 'dateUpdated' optionstamp.
	 * @private
	 * @param {Modeloption}     instance The entity model to be updated
	 * @param {UpdateOptions} options  Additional options of update propagated from the initial call
	**/
	static _auto_update_optionstamp(instance, options) {
		// @ts-ignore
		instance.dateUpdated = Sequelize.literal('CURRENT_TIMESTAMP');
	}
	get location() { return this.getDataValue("location"); }
    get date() { return this.getDataValue("date"); }
    get time() { return this.getDataValue("time"); }
}
