import ORM from 'sequelize'
const { Sequelize, DataTypes, Model } = ORM;
/**
 * A database entity model that represents contents in the database.
 * This model is specifically designed for users
 * @see "https://sequelize.org/master/manual/model-basics.html#taking-advantage-of-models-being-classes"
**/
export class Modelchoice extends Model {
	/**
	 * Initializer of the model
	 * @see Model.init
	 * @access public
	 * @param {Sequelize} database The configured Sequelize handle
	**/
	static initialize(database) {
		Modelchoice.init({
			"uuid"       : { type: DataTypes.CHAR(36),    foreignKey: true, defaultValue: DataTypes.UUIDV4 },
			"dateCreated": { type: DataTypes.DATE(),      allowNull: true, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
			"dateUpdated": { type: DataTypes.DATE(),      allowNull: true, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
			"time1": { type: DataTypes.STRING(128), allowNull: true,
				 set(value){ 
				this.setDataValue('time1', value);
			}
			},
			"time2": {
				type: DataTypes.STRING(128), allowNull: true, set(value) {
					this.setDataValue('time2', value);
				}},
			"time3": {
				type: DataTypes.STRING(128), allowNull: true, set(value) {
					this.setDataValue('time3', value);
				}},
			"time4": {
				type: DataTypes.STRING(128), allowNull: true, set(value) {
					this.setDataValue('time4', value);
				}},
			"time5": {
				type: DataTypes.STRING(128), allowNull: true, set(value) {
					this.setDataValue('time5', value);
				}},
			"location1": {
				type: DataTypes.STRING(600), allowNull: false, set(value) {
					this.setDataValue('location1', value);
				} },
			"location2": {
				type: DataTypes.STRING(600), allowNull: false, allowNull: true, set(value) {
					this.setDataValue('location2', value);
				} },
			"location3": {
				type: DataTypes.STRING(600), allowNull: false,  set(value) {
					this.setDataValue('location3', value);
				} },
			"location4": {
				type: DataTypes.STRING(600), allowNull: false,  set(value) {
					this.setDataValue('location4', value);
				} },
			"location5": {
				type: DataTypes.STRING(600), allowNull: false, set(value) {
					this.setDataValue('location5', value);
				} },
			"date1": {
				type: DataTypes.STRING(200), allowNull: false, set(value) {
					this.setDataValue('date1', value);
				} },
			"date2": {
				type: DataTypes.STRING(200), allowNull: false, set(value) {
					this.setDataValue('date2', value);
				} },
			"date3": {
				type: DataTypes.STRING(200), allowNull: false, set(value) {
					this.setDataValue('date3', value);
				} },
			"date4": {
				type: DataTypes.STRING(200), allowNull: false, set(value) {
					this.setDataValue('date4', value);
				} },
			"date5": {
				type: DataTypes.STRING(200), allowNull: false, set(value) {
					this.setDataValue('date5', value);
				} },

        }, {
			"sequelize": database,
			"modelName": "Choice",
			"hooks"    : {
				"afterUpdate": Modelchoice._auto_update_timestamp
			}
		});
	}

	/**
	 * Emulates "TRIGGER" of "AFTER UPDATE" in most SQL databases.
	 * This function simply assist to update the 'dateUpdated' timestamp.
	 * @private
	 * @param {Modelchoice}     instance The entity model to be updated  
	 * @param {UpdateOptions} options  Additional options of update propagated from the initial call
	**/
	static _auto_update_timestamp(instance, options) {
		// @ts-ignore
		instance.dateUpdated = Sequelize.literal('CURRENT_TIMESTAMP');
	}
	get time1() { return this.getDataValue("time1"); }
    get time2() { return this.getDataValue("time2"); }
    get time3() { return this.getDataValue("time3"); }
    get time4() { return this.getDataValue("time4"); }
    get time5() { return this.getDataValue("time5"); }
	get date1() { return this.getDataValue("date1"); }
	get date2() { return this.getDataValue("date2"); }
	get date3() { return this.getDataValue("date3"); }
	get date4() { return this.getDataValue("date4"); }
	get date5() { return this.getDataValue("date5"); }
	get location1() { return this.getDataValue("location1"); }
	get location2() { return this.getDataValue("location2"); }
	get location3() { return this.getDataValue("location3"); }
	get location4() { return this.getDataValue("location4"); }
	get location5() { return this.getDataValue("location5"); }
}
