import Hash   from 'hash.js'
import ORM    from 'sequelize';
const { Sequelize, DataTypes, Model, Op } = ORM;

import { ModelUser } from './user.mjs';
import { ModelHomeInfo } from '../data/homeinfo.mjs';
import { ModelRoomInfo } from '../data/roominfo.mjs';
import { ModelMovieInfo } from '../data/movieinfo.mjs';
import { ModelSongInfo } from '../data/songinfo.mjs';
import { ModelReview } from './review.mjs';
import { ModelFaq } from './faq.mjs';
import { Modelticket } from './tickets.mjs';
import { Modelpromo } from './promo.mjs';
/**
 * @param database {ORM.Sequelize}
 */
export function initialize_models(database) {
	try {
		console.log("Intitializing ORM models");
		//	Initialzie models
		ModelUser.initialize(database);
		ModelHomeInfo.initialize(database);
		ModelRoomInfo.initialize(database);
		ModelMovieInfo.initialize(database);
		ModelSongInfo.initialize(database);
		ModelReview.initialize(database);
		ModelFaq.initialize(database);
		Modelticket.initialize(database);
		Modelpromo.initialize(database);

		console.log("Building ORM model relations and indices");
		//	Create relations between models or tables
		//	Setup foreign keys, indexes etc
	
		console.log("Adding intitialization hooks");
		//	Run once hooks during initialization 
		database.addHook("afterBulkSync", generate_root_account.name,  generate_root_account.bind(this, database));
		// database.addHook("afterBulkSync", generate_homeinfo.homeinfo_uuid, generate_homeinfo.bind(this, database));
		// database.addHook("afterBulkSync", generate_roominfo.roominfo_uuid, generate_roominfo.bind(this, database));
		// database.addHook("afterBulkSync", generate_movieinfo.movieinfo_uuid, generate_movieinfo.bind(this, database));
		// database.addHook("afterBulkSync", generate_songinfo.songinfo_uuid, generate_songinfo.bind(this, database));
		database.addHook("afterBulkSync", generate_review.name, generate_review.bind(this, database));
		database.addHook("afterBulkSync", generate_Faq.name, generate_Faq.bind(this, database));
		// database.addHook("afterBulkSync", generate_ticket.email, generate_ticket.bind(this, database));
	}
	catch (error) {
		console.error ("Failed to configure ORM models");
		console.error (error);
	}
}

/**
 * This function creates a root account 
 * @param {Sequelize} database Database ORM handle
 * @param {SyncOptions} options Synchronization options, not used
 */
 async function generate_root_account(database, options) {
	//	Remove this callback to ensure it runs only once
	database.removeHook("afterBulkSync", generate_root_account.name);
	//	Create a root user if not exists otherwise update it
	try {
		console.log("Generating root administrator account");
		const root_parameters = {	
			uuid    : "00000000-0000-0000-0000-000000000000",
			name    : "manager",
			email   : "manager@mail.com",
			role    : "manager",
			verified: true,
			password: Hash.sha256().update("P@ssw0rd").digest("hex")
		};
		//	Find for existing account with the same id, create or update
		var account = await ModelUser.findOne({where: { "uuid": root_parameters.uuid }});
		
		account = await ((account) ? account.update(root_parameters): ModelUser.create(root_parameters));
		
		console.log("== Generated root account ==");
		console.log(account.toJSON());
		console.log("============================");
		return Promise.resolve();
	}
	catch (error) {
		console.error ("Failed to generate root administrator user account");
		console.error (error);
		return Promise.reject(error);
	}
}

/**
 * This function creates a root account 
 * @param {Sequelize} database Database ORM handle
 * @param {SyncOptions} options Synchronization options, not used
 */
async function generate_review(database, options) {
	//	Remove this callback to ensure it runs only once
	database.removeHook("afterBulkSync", generate_review.name);
	//	Create a root user if not exists otherwise update it
	try {
		console.log("Generating root administrator account");
		const root_parameters = {
			uuid: "00000000-0000-0000-0000-000000000000",
			"rating": '3',
			"feedback": "good",
			"TypeReview":"Movie",
			"user_id":"iwbhb",
			"type_id":"0000000000000000"
		};
		//	Find for existing account with the same id, create or update
		var account = await ModelReview.findOne({ where: { "uuid": root_parameters.uuid } });

		account = await ((account) ? account.update(root_parameters) : ModelReview.create(root_parameters));

		console.log("== Generated root account ==");
		console.log(account.toJSON());
		console.log("============================");
		return Promise.resolve();
	}
	catch (error) {
		console.error("Failed to generate root administrator user account");
		console.error(error);
		return Promise.reject(error);
	}
}

async function generate_Faq(database, options) {
	//	Remove this callback to ensure it runs only once
	database.removeHook("afterBulkSync", generate_Faq.uuid);
	//	Create a root user if not exists otherwise update it
	try {
		console.log("Generate_Faq");
		const root_parameters = {
			uuid: "00000000-0000-0000-0000-000000000000",
			questions: "Is this good?",
			answers: "Yes"

		};
		//	Find for existing account with the same id, create or update
		var account = await ModelFaq.findOne({ where: { "uuid": root_parameters.uuid } });
		account = await ((account) ? account.update(root_parameters) : ModelFaq.create(root_parameters));

		console.log("== Gxenerated root account ==");
		console.log(account.toJSON());
		console.log("============================");
		return Promise.resolve();
	}
	catch (error) {
		console.error("Failed to generate root administrator user account");
		console.error(error);
		return Promise.reject(error);
	}
}



