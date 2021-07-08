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
export class ModelRooms extends Model {
	/**
	 * Initializer of the model
	 * @see Model.init
	 * @access public
	 * @param {Sequelize} database The configured Sequelize handle
	**/
	static initialize(database) {
		ModelRooms.init({
			"uuid"       : { type: DataTypes.CHAR(36),    foreignKey: true, defaultValue: DataTypes.UUIDV4 },
			"dateCreated": { type: DataTypes.DATE(),      allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
			"dateUpdated": { type: DataTypes.DATE(),      allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
			"email"      : { type: DataTypes.STRING(128), allowNull: false },
			"role"       : { type: DataTypes.ENUM(UserRole.User, UserRole.Admin), defaultValue: UserRole.User, allowNull: false },
			"verified"   : { type: DataTypes.BOOLEAN,     allowNull: false, defaultValue: false},
            "prodlistid"     : { type: DataTypes.STRING(128) },

            "room_title" : { type: DataTypes.STRING(650), allowNull: false,
				set(value){ 
					this.setDataValue('room_title', value);
				}
			},
            "small_roominfo" : { type: DataTypes.STRING(650), allowNull: false,
				set(value){ 
					this.setDataValue('small_roominfo', value);
				}
			},
            "small_roomprice" : { type: DataTypes.STRING(650), allowNull: false,
				set(value){ 
					this.setDataValue('small_roomprice', value);
				}
			},
            "small_roomimage1" : { type: DataTypes.STRING(650), allowNull: false,
				set(value){ 
					this.setDataValue('small_roomimage1', value);
				}
			},
            "small_roomimage2" : { type: DataTypes.STRING(650), allowNull: false,
				set(value){ 
					this.setDataValue('small_roomimage2', value);
				}
			},
            "med_roominfo" : { type: DataTypes.STRING(650), allowNull: false,
				set(value){ 
					this.setDataValue('med_roominfo', value);
				}
			},
            "med_roomprice" : { type: DataTypes.STRING(650), allowNull: false,
				set(value){ 
					this.setDataValue('med_roomprice', value);
				}
			},
            "med_roomimage" : { type: DataTypes.STRING(650), allowNull: false,
				set(value){ 
					this.setDataValue('med_roomimage', value);
				}
			},
            "large_roominfo" : { type: DataTypes.STRING(650), allowNull: false,
				set(value){ 
					this.setDataValue('large_roominfo', value);
				}
			},
            "large_roomprice" : { type: DataTypes.STRING(650), allowNull: false,
				set(value){ 
					this.setDataValue('large_roomprice', value);
				}
			},
            "large_roomimage1" : { type: DataTypes.STRING(650), allowNull: false,
				set(value){ 
					this.setDataValue('large_roomimage1', value);
				}
			},
            "large_roomimage2" : { type: DataTypes.STRING(650), allowNull: false,
				set(value){ 
					this.setDataValue('large_roomimage2', value);
				}
			},
		}, {
			"sequelize": database,
			"modelName": "Rooms",
			"hooks"    : {
				"afterUpdate": ModelRooms._auto_update_timestamp
			}
		});
	}

	/**
	 * Emulates "TRIGGER" of "AFTER UPDATE" in most SQL databases.
	 * This function simply assist to update the 'dateUpdated' timestamp.
	 * @private
	 * @param {ModelRooms}     instance The entity model to be updated
	 * @param {UpdateOptions} options  Additional options of update propagated from the initial call
	**/
	static _auto_update_timestamp(instance, options) {
		// @ts-ignore
		instance.dateUpdated = Sequelize.literal('CURRENT_TIMESTAMP');
	}

    get email() { return this.getDataValue("email"); }
    get prodlistid() { return this.getDataValue("prodlistid"); }
	get room_title() { return String (this.getDataValue("room_title")); }
	get small_roominfo() { return String (this.getDataValue("small_roominfo")); }  
	get small_roomprice() { return String (this.getDataValue("small_roomprice")); }  
	get small_roomimage1() { return String (this.getDataValue("small_roomimage1")); }  
	get small_roomimage2() { return String (this.getDataValue("small_roomimage2")); }  

	get med_roominfo() { return String (this.getDataValue("med_roominfo")); }
	get med_roomprice() { return String (this.getDataValue("med_roomprice")); }  
	get med_roomimage() { return String (this.getDataValue("med_roomimage")); }

	get large_roominfo() { return String (this.getDataValue("large_roominfo")); }  
	get large_roomprice() { return String (this.getDataValue("large_roomprice")); }  
	get large_roomimage1() { return String (this.getDataValue("large_roomimage1")); }  
	get large_roomimage2() { return String (this.getDataValue("large_roomimage2")); } 
}