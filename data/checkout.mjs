import ORM from 'sequelize'
const { Sequelize, DataTypes, Model } = ORM;

/**
 * A database entity model that represents contents in the database.
 * This model is specifically designed for users
 * @see "https://sequelize.org/master/manual/model-basics.html#taking-advantage-of-models-being-classes"
**/
export class ModelCheckout extends Model {
	/**
	 * Initializer of the model
	 * @see Model.init
	 * @access public
	 * @param {Sequelize} database The configured Sequelize handle
	**/
	static initialize(database) {
		ModelCheckout.init({
			"uuid"       : { type: DataTypes.CHAR(36),    foreignKey: true, defaultValue: DataTypes.UUIDV4 },
			"dateCreated": { type: DataTypes.DATE(),      allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
			"dateUpdated": { type: DataTypes.DATE(),      allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
			"username": { type: DataTypes.STRING(100), allowNull: false },
			"card_number": { type: DataTypes.INTEGER(), allowNull: false },
			"card_holder"       : { type: DataTypes.STRING(650), allowNull: false },
			"expiry_month"   : { type: DataTypes.INTEGER(), allowNull: false },
            "expiry_year"     : { type: DataTypes.INTEGER(), allowNull:false },
            "ccv" : { type: DataTypes.INTEGER(), allowNull: false },
        }, {
			"sequelize": database,
			"modelName": "checkout",
			"hooks"    : {
				"afterUpdate": ModelCheckout._auto_update_timestamp
			}
		});
	}

	/**
	 * Emulates "TRIGGER" of "AFTER UPDATE" in most SQL databases.
	 * This function simply assist to update the 'dateUpdated' timestamp.
	 * @private
	 * @param {ModelCheckout}     instance The entity model to be updated
	 * @param {UpdateOptions} options  Additional options of update propagated from the initial call
	**/
	static _auto_update_timestamp(instance, options) {
		// @ts-ignore
		instance.dateUpdated = Sequelize.literal('CURRENT_TIMESTAMP');
	}
	get uuid() { return this.getDataValue("uuid"); }
    get card_number() { return this.getDataValue("card_number"); }
	get card_holder() { return this.getDataValue("card_holder"); }
	get expiry_month() { return this.getDataValue("expiry_month"); }
	get expiry_year() { return this.getDataValue("expiry_year"); }  
	get cvv() { return this.getDataValue("cvv"); }
	  
}
