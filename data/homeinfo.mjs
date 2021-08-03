import ORM from 'sequelize'
const { Sequelize, DataTypes, Model } = ORM;

/**
 * A database entity model that represents contents in the database.
 * This model is specifically designed for users
 * @see "https://sequelize.org/master/manual/model-basics.html#taking-advantage-of-models-being-classes"
**/
export class ModelHomeInfo extends Model {
	/**
	 * Initializer of the model
	 * @see Model.init
	 * @access public
	 * @param {Sequelize} database The configured Sequelize handle
	**/
	static initialize(database) {
		ModelHomeInfo.init({
			"homeinfo_uuid": { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4 },
			"dateCreated": { type: DataTypes.DATE(), allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
			"admin_uuid": { type: DataTypes.CHAR(36), defaultValue: DataTypes.UUIDV4 },
			"homedescription": { type: DataTypes.STRING(650), allowNull: false },
			"homepolicy": { type: DataTypes.STRING(128), allowNull: false },
			"homeimage": { type: DataTypes.STRING(4096), allowNull: false, defaultValue: "" },
			"homepolicyimage": { type: DataTypes.STRING(4096), allowNull: false, defaultValue: "" }
		}, {
			"sequelize": database,
			"modelName": "HomeInfo",
			"hooks": {
				"afterUpdate": ModelHomeInfo._auto_update_timestamp
			}
		});
	}

	/**
	 * Emulates "TRIGGER" of "AFTER UPDATE" in most SQL databases.
	 * This function simply assist to update the 'dateUpdated' timestamp.
	 * @private
	 * @param {ModelHomeInfo}     instance The entity model to be updated
	 * @param {UpdateOptions} options  Additional options of update propagated from the initial call
	**/
	static _auto_update_timestamp(instance, options) {
		// @ts-ignore
		instance.dateUpdated = Sequelize.literal('CURRENT_TIMESTAMP');
	}

	get homedescription() { return this.getDataValue("homedescription"); }
	get homepolicy() { return this.getDataValue("homepolicy"); }
	get homeimage() { return String(this.getDataValue("homeimage")); }
	get homepolicyimage() { return String(this.getDataValue("homepolicyimage")); }
}
