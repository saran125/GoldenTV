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
export class ModelBestReleases extends Model {
	/**
	 * Initializer of the model
	 * @see Model.init
	 * @access public
	 * @param {Sequelize} database The configured Sequelize handle
	**/
	static initialize(database) {
		ModelBestReleases.init({
			"uuid"       : { type: DataTypes.CHAR(36),    foreignKey: true, defaultValue: DataTypes.UUIDV4 },
			"dateCreated": { type: DataTypes.DATE(),      allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
			"dateUpdated": { type: DataTypes.DATE(),      allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
			"email"      : { type: DataTypes.STRING(128), allowNull: false },
			"role"       : { type: DataTypes.ENUM(UserRole.User, UserRole.Admin), defaultValue: UserRole.User, allowNull: false },
			"verified"   : { type: DataTypes.BOOLEAN,     allowNull: false, defaultValue: false},
            "homeid"     : { type: DataTypes.STRING(128) },
            "release_image1" : { type: DataTypes.STRING(650), allowNull: false, defaultValue: "",
				set(value){ 
					this.setDataValue('release_image1', value);
				}
			},
            "release_name1" : { type: DataTypes.STRING(650), allowNull: false, defaultValue: "",
				set(value){ 
					this.setDataValue('release_name1', value);
				}
			},
            "release_image2" : { type: DataTypes.STRING(650), allowNull: false, defaultValue: "" ,
				set(value){ 
					this.setDataValue('release_image2', value);
				}
			},
            "release_name2" : { type: DataTypes.STRING(650), allowNull: false, defaultValue: "" ,
				set(value){ 
					this.setDataValue('release_name2', value);
				}
			},
            "release_image3" : { type: DataTypes.STRING(650), allowNull: false, defaultValue: "" ,
				set(value){ 
					this.setDataValue('release_image3', value);
				}
			},
            "release_name3" : { type: DataTypes.STRING(650), allowNull: false, defaultValue: "" ,
				set(value){ 
					this.setDataValue('release_name3', value);
				}
			},
            "release_image4" : { type: DataTypes.STRING(650), allowNull: false, defaultValue: "" ,
				set(value){ 
					this.setDataValue('release_image4', value);
				}
			},
            "release_name4" : { type: DataTypes.STRING(650), allowNull: false, defaultValue: "" ,
				set(value){ 
					this.setDataValue('release_name4', value);
				}
			},
		}, {
			"sequelize": database,
			"modelName": "HomeBestReleases",
			"hooks"    : {
				"afterUpdate": ModelBestReleases._auto_update_timestamp
			}
		});
	}

	/**
	 * Emulates "TRIGGER" of "AFTER UPDATE" in most SQL databases.
	 * This function simply assist to update the 'dateUpdated' timestamp.
	 * @private
	 * @param {ModelBestReleases}     instance The entity model to be updated
	 * @param {UpdateOptions} options  Additional options of update propagated from the initial call
	**/
	static _auto_update_timestamp(instance, options) {
		// @ts-ignore
		instance.dateUpdated = Sequelize.literal('CURRENT_TIMESTAMP');
	}

    get email() { return this.getDataValue("email"); }
	get homeid() { return this.getDataValue("homeid"); }
	get release_image1() { return String (this.getDataValue("release_image1")); }
	get release_image2() { return String (this.getDataValue("release_image2")); }  
	get release_image3() { return String (this.getDataValue("release_image3")); }  
	get release_image4() { return String (this.getDataValue("release_image4")); }  
	get release_name1() { return this.getDataValue("release_name1"); }
	get release_name2() { return this.getDataValue("release_name2"); }  
	get release_name3() { return this.getDataValue("release_name3"); }  
	get release_name4() { return this.getDataValue("release_name4"); }   
}
