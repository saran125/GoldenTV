// import ORM from 'sequelize'
// const { Sequelize, DataTypes, Model } = ORM;

// import { DeleteFilePath } from '../routes/main.mjs';

// /**
//  * A database entity model that represents contents in the database.
//  * This model is specifically designed for users
//  * @see "https://sequelize.org/master/manual/model-basics.html#taking-advantage-of-models-being-classes"
// **/
// export class ModelHomeImagePolicy extends Model {
// 	/**
// 	 * Initializer of the model
// 	 * @see Model.init
// 	 * @access public
// 	 * @param {Sequelize} database The configured Sequelize handle
// 	**/
// 	static initialize(database) {
// 		ModelHomeImagePolicy.init({
// 			"uuid"       : { type: DataTypes.CHAR(36),    foreignKey: true, defaultValue: DataTypes.UUIDV4 },
// 			"dateCreated": { type: DataTypes.DATE(),      allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
// 			"dateUpdated": { type: DataTypes.DATE(),      allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
// 			"email"      : { type: DataTypes.STRING(128), allowNull: false },
// 			"role"       : { type: DataTypes.ENUM(UserRole.User, UserRole.Admin), defaultValue: UserRole.User, allowNull: false },
// 			"verified"   : { type: DataTypes.BOOLEAN,     allowNull: false, defaultValue: false},
//             "homeid"     : { type: DataTypes.STRING(128), allowNull: false  },
//             "homepolicy" : { type: DataTypes.STRING(128), allowNull: false ,
// 					set(value){ 
// 						this.setDataValue('homepolicy', value);
// 					} 
// 				},
//             "homeimage" : { type: DataTypes.STRING(4096), allowNull: false, defaultValue: "" ,
// 				set(value){ 
// 					this.setDataValue('homeimage', value);
// 				} 
// 			},
//             "homepolicyimage" : { type: DataTypes.STRING(4096), allowNull: false, defaultValue: "" ,
// 				set(value){ 
// 					this.setDataValue('homepolicyimage', value);
// 				} 
// 			}
// 		}, {
// 			"sequelize": database,
// 			"modelName": "HomeImagePolicy",
// 			"hooks"    : {
// 				"afterUpdate": ModelHomeImagePolicy._auto_update_timestamp
// 			}
// 		});
// 	}

// 	/**
// 	 * Emulates "TRIGGER" of "AFTER UPDATE" in most SQL databases.
// 	 * This function simply assist to update the 'dateUpdated' timestamp.
// 	 * @private
// 	 * @param {ModelHomeImagePolicy}     instance The entity model to be updated
// 	 * @param {UpdateOptions} options  Additional options of update propagated from the initial call
// 	**/
// 	static _auto_update_timestamp(instance, options) {
// 		// @ts-ignore
// 		instance.dateUpdated = Sequelize.literal('CURRENT_TIMESTAMP');
// 	}

// 	/**
// 	 * Deletes the profile data and its image
// 	 */
// 	 destroy() {
// 		if (this.resImgUrl.length > 0) {
// 			DeleteFilePath(`${process.cwd()}/${this.resImgUrl}`);
// 		}
// 		super.destroy();
// 	}

//     get email() { return this.getDataValue("email"); }
// 	get homeid() { return this.getDataValue("homeid"); }    
// 	get homepolicy() { return this.getDataValue("homepolicy"); }
//     get homeimage() { return String (this.getDataValue("homeimage")); }  
//     get homepolicyimage() { return String(this.getDataValue("homepolicyimage")); }  
// }
