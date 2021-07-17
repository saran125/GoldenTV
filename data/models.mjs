import Hash   from 'hash.js'
import ORM    from 'sequelize';
const { Sequelize, DataTypes, Model, Op } = ORM;

import { ModelUser } from './user.mjs';
import { ModelHomeInfo } from '../data/homeinfo.mjs';
// import { ModelHomeImagePolicy } from '../data/homeimagepolicy.mjs';
// import { ModelBestReleases } from '../data/homebestreleases.mjs';
import { ModelRoomInfo } from '../data/roominfo.mjs';
import { ModelMovies } from '../data/movies.mjs';
import { ModelSongs } from '../data/karaoke.mjs';
import { ModelReview } from './review.mjs';
import { ModelFaq } from './faq.mjs';
import { Modelticket } from './ticket.mjs';
import { Modeloption } from './option.mjs';
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
		ModelMovies.initialize(database);
		ModelSongs.initialize(database);
		ModelReview.initialize(database);
		ModelFaq.initialize(database);
		Modelticket.initialize(database);
	
		Modeloption.initialize(database);

		console.log("Building ORM model relations and indices");
		//	Create relations between models or tables
		//	Setup foreign keys, indexes etc
	
		console.log("Adding intitialization hooks");
		//	Run once hooks during initialization 
		database.addHook("afterBulkSync", generate_root_account.name,  generate_root_account.bind(this, database));
		database.addHook("afterBulkSync", generate_homeinfo.homeinfo_uuid, generate_homeinfo.bind(this, database));
		database.addHook("afterBulkSync", generate_roominfo.roominfo_uuid, generate_roominfo.bind(this, database));
		database.addHook("afterBulkSync", generate_movies.movie_uuid, generate_movies.bind(this, database));
		database.addHook("afterBulkSync", generate_songs.song_uuid, generate_songs.bind(this, database));
		database.addHook("afterBulkSync", generate_review.name, generate_review.bind(this, database));
		database.addHook("afterBulkSync", generate_Faq.name, generate_Faq.bind(this, database));
		database.addHook("afterBulkSync", generate_ticket.email, generate_ticket.bind(this, database));
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
            small_roomimage1: generate_roominfo.small_roomimage1,
            small_roomimage2: generate_roominfo.small_roomimage2,

            med_roominfo 	: generate_roominfo.med_roominfo,
            med_roomprice 	: generate_roominfo.med_roomprice,
            med_roomimage 	: generate_roominfo.med_roomimage,

            large_roominfo 	: generate_roominfo.large_roominfo,
            large_roomprice : generate_roominfo.large_roomprice,
            large_roomimage1: generate_roominfo.large_roomimage1,
            large_roomimage2: generate_roominfo.large_roomimage2
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
 async function generate_movies(database, options) {
	//	Remove this callback to ensure it runs only once
	database.removeHook("afterBulkSync", generate_movies.admin_uuid);
	//	Create a root user if not exists otherwise update it
	try {
		console.log("Generate_movies");
		const root_parameters = {	
			movie_uuid    	: generate_movies.movie_uuid,
			admin_uuid		: "00000000-0000-0000-0000-000000000000",
			user_uuid		: "00000000-0000-0000-0000-000000000000",
            movieimage		: generate_movies.movieimage,
            moviename		: generate_movies.moviename,
            movieagerating	: generate_movies.movieagerating,
            movieduration	: generate_movies.movieduration,

            movieHorror		: generate_movies.movieHorror,
            movieComedy		: generate_movies.movieComedy,
            movieScience	: generate_movies.movieScience,
        	movieRomance	: generate_movies.movieRomance,
            movieAnimation	: generate_movies.movieAnimation,
            movieAdventure	: generate_movies.movieAdventure,
            movieEmotional	: generate_movies.movieEmotional,
            movieMystery	: generate_movies.movieMystery,
            movieAction		: generate_movies.movieAction
		};
		//	Find for existing account with the same id, create or update
		var account = await ModelMovies.findOne({where: { "admin_uuid": root_parameters.admin_uuid }});
		
		account = await ((account) ? account.update(root_parameters): ModelMovies.create(root_parameters));
		
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
 async function generate_songs(database, options) {
	//	Remove this callback to ensure it runs only once
	database.removeHook("afterBulkSync", generate_songs.email);
	//	Create a root user if not exists otherwise update it
	try {
		console.log("Generate_songs");
		const root_parameters = {	
			song_uuid    	: generate_songs.song_uuid,
			admin_uuid		: "00000000-0000-0000-0000-000000000000",
			user_uuid		: "00000000-0000-0000-0000-000000000000",
            songimage		: generate_songs.songimage,
            songname		: generate_songs.songname,
            songagerating	: generate_songs.songagerating,
            songduration	: 1,

            songPop			: generate_songs.songPop,
            songRock		: generate_songs.songRock,
            songMetal		: generate_songs.songMetal,
        	songCountry		: generate_songs.songCountry,
            songRap			: generate_songs.songRap,
            songElectronic	: generate_songs.songElectronic,
            songJazz		: generate_songs.songJazz,
            songFolk		: generate_songs.songFolk
		};
		//	Find for existing account with the same id, create or update
		var account = await ModelSongs.findOne({where: { "admin_uuid": root_parameters.admin_uuid }});
		
		account = await ((account) ? account.update(root_parameters): ModelSongs.create(root_parameters));
		
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

/**
 * This function creates a root account 
 * @param {Sequelize} database Database ORM handle
 * @param {SyncOptions} options Synchronization options, not used
 */
async function generate_ticket(database, options) {
	//	Remove this callback to ensure it runs only once
	database.removeHook("afterBulkSync", generate_ticket.uuid);
	//	Create a root user if not exists otherwise update it
	try {
		console.log("Generate_ticket page");
		const root_parameters = {
			uuid: "00000000-0000-0000-0000-000000000000",
			choice: "movie",
			location: "Bishan",
			date: "17th may 2020",
			time: "9am",
			roomtype: "Small",
			ref: "1234abcd"
		};
		//	Find for existing account with the same id, create or update
		var account = await Modelticket.findOne({ where: { "uuid": root_parameters.uuid } });
		account = await ((account) ? account.update(root_parameters) : Modelticket.create(root_parameters));
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




