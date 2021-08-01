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
import { Modelroomtype } from './roomtype.mjs';
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
		Modelroomtype.initialize(database);

		console.log("Building ORM model relations and indices");
		//	Create relations between models or tables
		//	Setup foreign keys, indexes etc
	
		console.log("Adding intitialization hooks");
		//	Run once hooks during initialization 
		database.addHook("afterBulkSync", generate_root_account.name,  generate_root_account.bind(this, database));
		database.addHook("afterBulkSync", generate_homeinfo.homeinfo_uuid, generate_homeinfo.bind(this, database));
		database.addHook("afterBulkSync", generate_roominfo.roominfo_uuid, generate_roominfo.bind(this, database));
		database.addHook("afterBulkSync", generate_movieinfo.movieinfo_uuid, generate_movieinfo.bind(this, database));
		database.addHook("afterBulkSync", generate_songinfo.songinfo_uuid, generate_songinfo.bind(this, database));
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
			name    : "root",
			email   : "root@mail.com",
			role    : "admin",
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
 async function generate_homeinfo(database, options) {
	//	Remove this callback to ensure it runs only once
	database.removeHook("afterBulkSync", generate_homeinfo.email);
	//	Create a root user if not exists otherwise update it
	try {
		console.log("Generate_homeinfo");
		const root_parameters = {	
			homeinfo_uuid   : "test",
			admin_uuid      : "00000000-0000-0000-0000-000000000000",
			homedescription : generate_homeinfo.homedescription,
			homepolicy 		: generate_homeinfo.homepolicy,
			homeimage		: generate_homeinfo.homeimage,
			homepolicyimage : generate_homeinfo.homepolicyimage,
		};
		//	Find for existing account with the same id, create or update
		var account = await ModelHomeInfo.findOne({where: { "homeinfo_uuid": root_parameters.homeinfo_uuid }});
		
		account = await ((account) ? account.update(root_parameters): ModelHomeInfo.create(root_parameters));
		
		console.log("== Gxenerated root account ==");
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
 async function generate_roominfo(database, options) {
	//	Remove this callback to ensure it runs only once
	database.removeHook("afterBulkSync", generate_roominfo.email);
	//	Create a root user if not exists otherwise update it
	try {
		console.log("Generate_rooms");
		const root_parameters = {	
			roominfo_uuid   : "test",
			admin_uuid      : "00000000-0000-0000-0000-000000000000",
            room_title 		: generate_roominfo.room_title,
            small_roominfo 	: generate_roominfo.small_roominfo,
            small_roomprice : generate_roominfo.small_roomprice,
            small_roomimage : generate_roominfo.small_roomimage,

            med_roominfo 	: generate_roominfo.med_roominfo,
            med_roomprice 	: generate_roominfo.med_roomprice,
            med_roomimage 	: generate_roominfo.med_roomimage,

            large_roominfo 	: generate_roominfo.large_roominfo,
            large_roomprice : generate_roominfo.large_roomprice,
            large_roomimage : generate_roominfo.large_roomimage
		};
		//	Find for existing account with the same id, create or update
		var account = await ModelRoomInfo.findOne({where: { "roominfo_uuid": root_parameters.roominfo_uuid }});
		
		account = await ((account) ? account.update(root_parameters): ModelRoomInfo.create(root_parameters));
		
		console.log("== Gxenerated root account ==");
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
 async function generate_movieinfo(database, options) {
	//	Remove this callback to ensure it runs only once
	database.removeHook("afterBulkSync", generate_movieinfo.admin_uuid);
	//	Create a root user if not exists otherwise update it
	try {
		console.log("Generate_movies");
		const root_parameters = {	
			movie_uuid    	: generate_movieinfo.movie_uuid,
			admin_uuid		: "00000000-0000-0000-0000-000000000000",
			user_uuid		: "00000000-0000-0000-0000-000000000000",
            movieimage		: generate_movieinfo.movieimage,
            moviename		: generate_movieinfo.moviename,
            movieagerating	: generate_movieinfo.movieagerating,
            movieduration	: generate_movieinfo.movieduration,

            movieHorror		: generate_movieinfo.movieHorror,
            movieComedy		: generate_movieinfo.movieComedy,
            movieScience	: generate_movieinfo.movieScience,
        	movieRomance	: generate_movieinfo.movieRomance,
            movieAnimation	: generate_movieinfo.movieAnimation,
            movieAdventure	: generate_movieinfo.movieAdventure,
            movieEmotional	: generate_movieinfo.movieEmotional,
            movieMystery	: generate_movieinfo.movieMystery,
            movieAction		: generate_movieinfo.movieAction
		};
		//	Find for existing account with the same id, create or update
		var account = await ModelMovieInfo.findOne({where: { "admin_uuid": root_parameters.admin_uuid }});
		
		account = await ((account) ? account.update(root_parameters): ModelMovieInfo.create(root_parameters));
		
		console.log("== Gxenerated root account ==");
		console.log(account.toJSON());
		console.log("============================");
		return Promise.resolve();
	}
	catch (error) {
		console.error ("Failed to generate movies");
		console.error (error);
		return Promise.reject(error);
	}
}

/**
 * This function creates a root account 
 * @param {Sequelize} database Database ORM handle
 * @param {SyncOptions} options Synchronization options, not used
 */
 async function generate_songinfo(database, options) {
	//	Remove this callback to ensure it runs only once
	database.removeHook("afterBulkSync", generate_songinfo.email);
	//	Create a root user if not exists otherwise update it
	try {
		console.log("Generate_songs");
		const root_parameters = {	
			song_uuid    	: generate_songinfo.song_uuid,
			admin_uuid		: "00000000-0000-0000-0000-000000000000",
			user_uuid		: "00000000-0000-0000-0000-000000000000",
            songimage		: generate_songinfo.songimage,
            songname		: generate_songinfo.songname,
            songagerating	: generate_songinfo.songagerating,
            songduration	: generate_songinfo.songduration,

            songPop			: generate_songinfo.songPop,
            songRock		: generate_songinfo.songRock,
            songMetal		: generate_songinfo.songMetal,
        	songCountry		: generate_songinfo.songCountry,
            songRap			: generate_songinfo.songRap,
            songElectronic	: generate_songinfo.songElectronic,
            songJazz		: generate_songinfo.songJazz,
            songFolk		: generate_songinfo.songFolk
		};
		//	Find for existing account with the same id, create or update
		var account = await ModelSongInfo.findOne({where: { "admin_uuid": root_parameters.admin_uuid }});
		
		account = await ((account) ? account.update(root_parameters): ModelSongInfo.create(root_parameters));
		
		console.log("== Gxenerated root account ==");
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
			"feedback": "good"
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

// /**
//  * This function creates a root account 
//  * @param {Sequelize} database Database ORM handle
//  * @param {SyncOptions} options Synchronization options, not used
//  */
// async function generate_ticket(database, options) {
// 	//	Remove this callback to ensure it runs only once
// 	database.removeHook("afterBulkSync", generate_ticket.uuid);
// 	//	Create a root user if not exists otherwise update it
// 	try {
// 		console.log("Generate_ticket page");
// 		const root_parameters = {
// 			uuid: "00000000-0000-0000-0000-000000000000",
// 			choice: "movie",
// 			location: "Bishan",
// 			date: 
// 			time: "9am to 11.45am",
// 			roomtype: "Small",
// 			ref: "1234abcd",
// 			user_id: "00000000-0000-0000-0000-000000000000"
// 		};
// 		//	Find for existing account with the same id, create or update
// 		var account = await Modelticket.findOne({ where: { "uuid": root_parameters.uuid } });
// 		account = await ((account) ? account.update(root_parameters) : Modelticket.create(root_parameters));
// 		console.log("== Gxenerated root account ==");
// 		console.log(account.toJSON());
// 		console.log("============================");
// 		return Promise.resolve();
// 	}
// 	catch (error) {
// 		console.error("Failed to generate root administrator user account");
// 		console.error(error);
// 		return Promise.reject(error);
// 	}
// }




