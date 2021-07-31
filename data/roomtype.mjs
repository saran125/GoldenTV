import ORM from 'sequelize'
const { Sequelize, DataTypes, Model } = ORM;
import  moment  from 'moment';

/**
 * A database entity model that represents contents in the database.
 * This model is specifically designed for users
 * @see "https://sequelize.org/master/manual/model-basics.html#taking-advantage-of-models-being-classes"
**/
export class Modelroomtype extends Model {
	/**
	 * Initializer of the model
	 * @see Model.init
	 * @access public
	 * @param {Sequelize} database The configured Sequelize handle
	**/
	static initialize(database) {
		Modelroomtype.init({
			"roomtype_id"       : { type: DataTypes.CHAR(36),    primaryKey: true, defaultValue: DataTypes.UUIDV4 },
			"dateCreated": {
				type: DataTypes.DATE(), allowNull: true, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')},
			"dateUpdated": { type: DataTypes.DATE(), allowNull: true, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
			"location"   : { type: DataTypes.STRING(600), allowNull: true, defaultValue:"not"},
			"date": { type: DataTypes.DATEONLY(), allowNull: true },
			"time": { type: DataTypes.ENUM('9am to 11.45am', '12pm to 2.45pm', '3pm to 5.45pm', '6pm to 8.45pm', '9pm to 11.45pm'), allowNull: true },
			"roomtype": { type: DataTypes.ENUM('Small', 'Medium', 'Large'), allowNull: true  },
			"price": { type: DataTypes.INTEGER(), allowNull: true },
			"booked": { type: DataTypes.ENUM("No", "Yes"), allowNull: true, defaultValue: "No"},
			"choice": { type: DataTypes.ENUM("song", "movie"), defaultValue: null},
			"user_id": { type: DataTypes.CHAR(36),allowNull: true, defaultValue: null },
			"admin_uuid": { type: DataTypes.CHAR(36),allowNull:true,  defaultValue: null}
        }, {
			"sequelize": database,
			"modelName": "roomtype",
			"hooks"    : {
				"afterUpdate": Modelroomtype._auto_update_optionstamp
			}
		});
	}

	/**
	 * Emulates "TRIGGER" of "AFTER UPDATE" in most SQL databases.
	 * This function simply assist to update the 'dateUpdated' optionstamp.
	 * @private
	 * @param {Modelroomtype}     instance The entity model to be updated
	 * @param {UpdateOptions} options  Additional options of update propagated from the initial call
	**/
	static _auto_update_optionstamp(instance, options) {
		// @ts-ignore
		instance.dateUpdated = Sequelize.literal('CURRENT_TIMESTAMP');
	}
	get location() { return this.getDataValue("location"); }
    get date() { return this.getDataValue("date"); }
    get time() { return this.getDataValue("time"); } 
	get roomtype() { return this.getDataValue("roomtype");  }
	get price() { return this.getDataValue("price"); }
}
