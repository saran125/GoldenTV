import ORM from 'sequelize'
const { Sequelize, DataTypes, Model, Op } = ORM;

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
export class ModelMovies extends Model {
	/**
	 * Initializer of the model
	 * @see Model.init
	 * @access public
	 * @param {Sequelize} database The configured Sequelize handle
	**/
	static initialize(database) {
		ModelMovies.init({
			"uuid"       : { type: DataTypes.CHAR(36),    primaryKey: true, defaultValue: DataTypes.UUIDV4 },
			"dateCreated": { type: DataTypes.DATE(),      allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
			"dateUpdated": { type: DataTypes.DATE(),      allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
			"email"      : { type: DataTypes.STRING(128), allowNull: false },
			"role"       : { type: DataTypes.ENUM(UserRole.User, UserRole.Admin), defaultValue: UserRole.User, allowNull: false },
            "verified"   : { type: DataTypes.BOOLEAN,     allowNull: false, defaultValue: false},
            "prodlistid"     : { type: DataTypes.STRING(128) },
            "choosemovieid"     : { type: DataTypes.STRING(128) },

            "movieimage" : { type: DataTypes.STRING(650), allowNull: false,
				set(value){ 
					this.setDataValue('movieimage', value);
				} 
			},
            "moviename" : { type: DataTypes.STRING(650), allowNull: false,
				set(value){ 
					this.setDataValue('moviename', value);
				} 
			},
            "movieagerating" : { type: DataTypes.STRING(650), allowNull: false,
				set(value){ 
					this.setDataValue('movieagerating', value);
				} 
			},
            "movieduration" : { type: DataTypes.STRING(650), allowNull: false,
				set(value){ 
					this.setDataValue('movieduration', value);
				} 
			},
            "movieHorror" : { type: DataTypes.STRING(65), allowNull: false, 
				set(value){ 
					this.setDataValue('movieHorror', value);
				} 
			},
            "movieComedy" : { type: DataTypes.STRING(65), allowNull: false, 
				set(value){ 
					this.setDataValue('movieComedy', value);
				} 
			},
            "movieScience" : { type: DataTypes.STRING(65), allowNull: false, 
				set(value){ 
					this.setDataValue('movieScience', value);
				} 
			},
            "movieRomance" : { type: DataTypes.STRING(65), allowNull: false, 
				set(value){ 
					this.setDataValue('movieRomance', value);
				} 
			},
            "movieAnimation" : { type: DataTypes.STRING(65), allowNull: false, 
				set(value){ 
					this.setDataValue('movieAnimation', value);
				} 
			},
            "movieAdventure" : { type: DataTypes.STRING(65), allowNull: false, 
				set(value){ 
					this.setDataValue('movieAdventure', value);
				} 
			},
            "movieEmotional" : { type: DataTypes.STRING(65), allowNull: false, 
				set(value){ 
					this.setDataValue('movieEmotional', value);
				} 
			},
            "movieMystery" : { type: DataTypes.STRING(65), allowNull: false, 
				set(value){ 
					this.setDataValue('movieMystery', value);
				} 
			},
            "movieAction" : { type: DataTypes.STRING(65), allowNull: false, 
				set(value){ 
					this.setDataValue('movieAction', value);
				} 
			}
		}, {
			"sequelize": database,
			"modelName": "Movies",
			"hooks"    : {
				"afterUpdate": ModelMovies._auto_update_timestamp
			}
		});
	}

	/**
	 * Emulates "TRIGGER" of "AFTER UPDATE" in most SQL databases.
	 * This function simply assist to update the 'dateUpdated' timestamp.
	 * @private
	 * @param {ModelMovies}     instance The entity model to be updated
	 * @param {UpdateOptions} options  Additional options of update propagated from the initial call
	**/
	static _auto_update_timestamp(instance, options) {
		// @ts-ignore
		instance.dateUpdated = Sequelize.literal('CURRENT_TIMESTAMP');
	}

    get email() { return this.getDataValue("email"); }
    get prodlistid() { return this.getDataValue("prodlistid"); }
    get choosemovieid() { return this.getDataValue("choosemovieid"); }

	get movieimage() { return this.getDataValue("movieimage"); }
	get moviename() { return this.getDataValue("moviename"); }  
	get movieagerating() { return this.getDataValue("movieagerating"); }
	get movieduration() { return this.getDataValue("movieduration"); }        

    get movieHorror() { return this.getDataValue("movieHorror"); }
	get movieComedy() { return this.getDataValue("movieComedy"); }
	get movieScience() { return this.getDataValue("movieScience"); }  
	get movieRomance() { return this.getDataValue("movieRomance"); }  
	get movieAnimation() { return this.getDataValue("movieAnimation"); }  
	get movieAdventure() { return this.getDataValue("movieAdventure"); }  
	get movieEmotional() { return this.getDataValue("movieEmotional"); }
	get movieMystery() { return this.getDataValue("movieMystery"); }  
	get movieAction() { return this.getDataValue("movieAction"); }
}