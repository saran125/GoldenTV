import ORM from 'sequelize'
const { Sequelize, DataTypes, Model } = ORM;

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
			"song_uuid"   : { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4 },
			"dateCreated": { type: DataTypes.DATE(), allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
			"dateUpdated": { type: DataTypes.DATE(), allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
			"admin_uuid" : { type: DataTypes.CHAR(36), defaultValue: DataTypes.UUIDV4 },
			"user_uuid" : { type: DataTypes.CHAR(36), defaultValue: DataTypes.UUIDV4 },	

            "songimage" : { type: DataTypes.STRING(650), allowNull: false },
            "songname" : { type: DataTypes.STRING(650), allowNull: false },
            "songagerating" : { type: DataTypes.STRING(650), allowNull: false },
            "songduration" : { type: DataTypes.STRING(650), allowNull: false },

            "songPop" : { type: DataTypes.STRING(65), allowNull: false },
            "songRock" : { type: DataTypes.STRING(65), allowNull: false },
            "songMetal" : { type: DataTypes.STRING(65), allowNull: false },
            "songCountry" : { type: DataTypes.STRING(65), allowNull: false },
            "songRap" : { type: DataTypes.STRING(65), allowNull: false },
            "songElectronic" : { type: DataTypes.STRING(65), allowNull: false },
            "songJazz" : { type: DataTypes.STRING(65), allowNull: false },
            "songFolk" : { type: DataTypes.STRING(65), allowNull: false }
		}, {
			"sequelize": database,
			"modelName": "SongInfo",
			"hooks"    : {
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
		instance.dateUpdated = Sequelize.literal('CURRENT_TIMESTAMP');
	}
    
	get songimage() { return this.getDataValue("songimage"); }
	get songname() { return this.getDataValue("songname"); }  
	get songagerating() { return this.getDataValue("songagerating"); }
	get songduration() { return this.getDataValue("songduration"); }        

    get songPop() { return this.getDataValue("songPop"); }
	get songRock() { return this.getDataValue("songRock"); }
	get songMetal() { return this.getDataValue("songMetal"); }  
	get songCountry() { return this.getDataValue("songCountry"); }  
	get songRap() { return this.getDataValue("songRap"); }  
	get songElectronic() { return this.getDataValue("songElectronic"); }  
	get songJazz() { return this.getDataValue("songJazz"); }
	get songFolk() { return this.getDataValue("songFolk"); }  
}