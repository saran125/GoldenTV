import ORM from 'sequelize'
const { Sequelize, DataTypes, Model, Op } = ORM;
import date from 'date-and-time';

const now = new Date();
const DateNow = date.format(now, 'MMM DD, YYYY HH:mm:ss');
/**
 * A database entity model that represents contents in the database.
 * This model is specifically designed for users
 * @see "https://sequelize.org/master/manual/model-basics.html#taking-advantage-of-models-being-classes"
**/
export class ModelMovieInfo extends Model {
	/**
	 * Initializer of the model
	 * @see Model.init
	 * @access public
	 * @param {Sequelize} database The configured Sequelize handle
	**/
	static initialize(database) {
		ModelMovieInfo.init({
			"movie_uuid": { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4 },
			"dateCreated": { type: DataTypes.STRING(50), allowNull: false, defaultValue: DateNow },
			"dateUpdated": { type: DataTypes.STRING(50), allowNull: false, defaultValue: DateNow },
			"admin_uuid": { type: DataTypes.CHAR(36), allowNull: false },
			"user_uuid": { type: DataTypes.CHAR(36) },
			"movieimage": { type: DataTypes.STRING(650), allowNull: false },
			"moviename": { type: DataTypes.STRING(650), allowNull: false },
			"movieagerating": { type: DataTypes.STRING(650), allowNull: false },
			"moviecountdown": { type: DataTypes.STRING(20), allowNull: false },
			"movieduration": { type: DataTypes.FLOAT(4), allowNull: false },
			"moviegenre": {
				type: DataTypes.ENUM('Horror', 'Comedy', 'Science', 'Romance', 'Animation', 'Adventure', 'Emotional', 'Action')
				, allowNull: false
			}
		}, {
			"sequelize": database,
			"modelName": "MovieInfo",
			"hooks": {
				"afterUpdate": ModelMovieInfo._auto_update_timestamp
			}
		});
	}

	/**
	 * Emulates "TRIGGER" of "AFTER UPDATE" in most SQL databases.
	 * This function simply assist to update the 'dateUpdated' timestamp.
	 * @private
	 * @param {ModelMovieInfo}     instance The entity model to be updated
	 * @param {UpdateOptions} options  Additional options of update propagated from the initial call
	**/
	static _auto_update_timestamp(instance, options) {
		// @ts-ignore
		instance.dateUpdated = Sequelize.literal('CURRENT_TIMESTAMP');
	}

	get movieimage() { return this.getDataValue("movieimage"); }
	get moviename() { return this.getDataValue("moviename"); }
	get movieagerating() { return this.getDataValue("movieagerating"); }
	get movieduration() { return this.getDataValue("movieduration"); }
	get dateUpdated() { return this.getDataValue("dateUpdated") };
	get moviegenre() { return this.getDataValue("moviegenre") };
}