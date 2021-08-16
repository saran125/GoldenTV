import ORM from 'sequelize'
const { Sequelize, DataTypes, Model } = ORM;
import date from 'date-and-time';

const now = new Date();
const DateNow = date.format(now, 'YYYY/MM/DD HH:mm:ss');
/**
 * A database entity model that represents contents in the database.
 * This model is specifically designed for users
 * @see "https://sequelize.org/master/manual/model-basics.html#taking-advantage-of-models-being-classes"
**/
export class ModelSongInfo extends Model {
	/**
	 * Initializer of the model
	 * @see Model.init
	 * @access public
	 * @param {Sequelize} database The configured Sequelize handle
	**/
	static initialize(database) {
		ModelSongInfo.init({
			"song_uuid": { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4 },
			"dateCreated": { type: DataTypes.DATE(), allowNull: false, defaultValue: DateNow },
			"dateUpdated": { type: DataTypes.DATE(), allowNull: false, defaultValue: DateNow },
			"admin_uuid": { type: DataTypes.CHAR(36), defaultValue: DataTypes.UUIDV4 },
			"songimage": { type: DataTypes.STRING(650), allowNull: false },
			"songname": { type: DataTypes.STRING(650), allowNull: false },
			"songagerating": { type: DataTypes.STRING(650), allowNull: false },
			"songduration": { type: DataTypes.FLOAT(4), allowNull: false },
			"songgenre": {
				type: DataTypes.ENUM('Pop', 'Rock', 'Metal', 'Country', 'Rap', 'Electronic', 'Jazz', 'Folk')
				, allowNull: false
			}
		}, {
			"sequelize": database,
			"modelName": "SongInfo",
			"hooks": {
				"afterUpdate": ModelSongInfo._auto_update_timestamp
			}
		});
	}

	/**
	 * Emulates "TRIGGER" of "AFTER UPDATE" in most SQL databases.
	 * This function simply assist to update the 'dateUpdated' timestamp.
	 * @private
	 * @param {ModelSongInfo}     instance The entity model to be updated
	 * @param {UpdateOptions} options  Additional options of update propagated from the initial call
	**/
	static _auto_update_timestamp(instance, options) {
		// @ts-ignore
		instance.dateUpdated = DateNow;
	}

	get song_uuid() { return this.getDataValue("song_uuid"); }
	get admin_uuid() { return this.getDataValue("admin_uuid"); }
	get dateUpdated() { return this.getDataValue("dateUpdated") };
	get dateCreated() { return this.getDataValue("dateCreated") };
	get songimage() { return this.getDataValue("songimage"); }
	get songname() { return this.getDataValue("songname"); }
	get songagerating() { return this.getDataValue("songagerating"); }
	get songduration() { return this.getDataValue("songduration"); }
	get songgenre() { return this.getDataValue("songgenre"); }
}