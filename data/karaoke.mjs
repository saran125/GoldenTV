import ORM from 'sequelize'
const { Sequelize, DataTypes, Model } = ORM;

/**
 * For enumeration use
**/
export class UserRole {
	static get Admin() { return "admin"; }
	static get User()  { return "user";  }
}
/**
 * A database entity model that represents contents in the database.
 * This model is specifically designed for users
 * @see "https://sequelize.org/master/manual/model-basics.html#taking-advantage-of-models-being-classes"
**/
export class ModelSongs extends Model {
	/**
	 * Initializer of the model
	 * @see Model.init
	 * @access public
	 * @param {Sequelize} database The configured Sequelize handle
	**/
	static initialize(database) {
		ModelSongs.init({
			"uuid"       : { type: DataTypes.CHAR(36),    primaryKey: true, defaultValue: DataTypes.UUIDV4 },
			"dateCreated": { type: DataTypes.DATE(),      allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
			"dateUpdated": { type: DataTypes.DATE(),      allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
			"email"      : { type: DataTypes.STRING(128), allowNull: false },
			"role"       : { type: DataTypes.ENUM(UserRole.User, UserRole.Admin), defaultValue: UserRole.User, allowNull: false },
            "verified"   : { type: DataTypes.BOOLEAN,     allowNull: false, defaultValue: false},
            "prodlistid"     : { type: DataTypes.STRING(128) },
            "choosekaraokeid"     : { type: DataTypes.STRING(128) },

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
			"modelName": "Songs",
			"hooks"    : {
				"afterUpdate": ModelSongs._auto_update_timestamp
			}
		});
	}

	/**
	 * Emulates "TRIGGER" of "AFTER UPDATE" in most SQL databases.
	 * This function simply assist to update the 'dateUpdated' timestamp.
	 * @private
	 * @param {ModelSongs}     instance The entity model to be updated
	 * @param {UpdateOptions} options  Additional options of update propagated from the initial call
	**/
	static _auto_update_timestamp(instance, options) {
		// @ts-ignore
		instance.dateUpdated = Sequelize.literal('CURRENT_TIMESTAMP');
	}
    
    get email() { return this.getDataValue("email"); }
    get prodlistid() { return this.getDataValue("prodlistid"); }
    get choosekaraokeid() { return this.getDataValue("choosekaraokeid"); }

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