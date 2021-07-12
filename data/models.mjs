import Hash   from 'hash.js'
import ORM    from 'sequelize';
const { Sequelize, DataTypes, Model, Op } = ORM;

import { ModelUser } from './user.mjs';
import { ModelHomeDescription} from './homedescription.mjs';
import { ModelHomeImagePolicy } from '../data/homeimagepolicy.mjs';
import { ModelBestReleases } from '../data/homebestreleases.mjs';
import { ModelRooms } from '../data/rooms.mjs';
import { ModelMovies } from '../data/movies.mjs';
import { ModelSongs } from '../data/karaoke.mjs';
import { ModelReview } from './review.mjs';
import { ModelFaq } from './faq.mjs';
import { ModelRoomtype } from './roomtype.mjs';
import { ModelCheckout } from './checkout.mjs';
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
		ModelHomeDescription.initialize(database);
		ModelHomeImagePolicy.initialize(database);
		ModelBestReleases.initialize(database);
		ModelRooms.initialize(database);
		ModelMovies.initialize(database);
		ModelSongs.initialize(database);
		ModelReview.initialize(database);
		ModelFaq.initialize(database);
		ModelRoomtype.initialize(database);
		ModelCheckout.initialize(database);
		Modelticket.initialize(database);
	
		Modeloption.initialize(database);

		console.log("Building ORM model relations and indices");
		//	Create relations between models or tables
		//	Setup foreign keys, indexes etc
	
		console.log("Adding intitialization hooks");
		//	Run once hooks during initialization 
		database.addHook("afterBulkSync", generate_root_account.name,  generate_root_account.bind(this, database));
		database.addHook("afterBulkSync", generate_homedescription.email, generate_homedescription.bind(this, database));
		database.addHook("afterBulkSync", generate_homeimagepolicy.email, generate_homeimagepolicy.bind(this, database));
		database.addHook("afterBulkSync", generate_bestreleases.email,  generate_bestreleases.bind(this, database));
		database.addHook("afterBulkSync", generate_rooms.email, generate_rooms.bind(this, database));
		database.addHook("afterBulkSync", generate_movies.email, generate_movies.bind(this, database));
		database.addHook("afterBulkSync", generate_songs.email, generate_songs.bind(this, database));
		database.addHook("afterBulkSync", generate_review.name, generate_review.bind(this, database));
		database.addHook("afterBulkSync", generate_Faq.name, generate_Faq.bind(this, database));
		database.addHook("afterBulkSync", generate_ticket.email, generate_ticket.bind(this, database));
		database.addHook("afterBulkSync", generate_roomtype.uuid, generate_roomtype.bind(this, database));
		database.addHook("afterBulkSync", generate_checkout.uuid, generate_checkout.bind(this, database));

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
 async function generate_homedescription(database, options) {
	//	Remove this callback to ensure it runs only once
	database.removeHook("afterBulkSync", generate_homedescription.email);
	//	Create a root user if not exists otherwise update it
	try {
		console.log("Generate_homedescription");
		const root_parameters = {	
			uuid    : "00000000-0000-0000-0000-000000000000",
			email   : "root@mail.com",
			role    : "admin",
			verified: true,
			homeid  : "homeid",
			homedescription : generate_homedescription.homedescription
		};
		//	Find for existing account with the same id, create or update
		var account = await ModelHomeDescription.findOne({where: { "uuid": root_parameters.uuid }});
		
		account = await ((account) ? account.update(root_parameters): ModelHomeDescription.create(root_parameters));
		
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
 async function generate_homeimagepolicy(database, options) {
	//	Remove this callback to ensure it runs only once
	database.removeHook("afterBulkSync", generate_homeimagepolicy.email);
	//	Create a root user if not exists otherwise update it
	try {
		console.log("Generate_homeimagepolicy");
		const root_parameters = {	
			uuid    : "00000000-0000-0000-0000-000000000000",
			email   : "root@mail.com",
			role    : "admin",
			verified: true,
			homeid  : "id",
			homepolicy : generate_homeimagepolicy.homepolicy,
			homeimage: generate_homeimagepolicy.homeimage,
			homepolicyimage : generate_homeimagepolicy.homepolicyimage
		};
		//	Find for existing account with the same id, create or update
		var account = await ModelHomeImagePolicy.findOne({where: { "email": root_parameters.email }});
		
		account = await ((account) ? account.update(root_parameters): ModelHomeImagePolicy.create(root_parameters));
		
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
 async function generate_bestreleases(database, options) {
	//	Remove this callback to ensure it runs only once
	database.removeHook("afterBulkSync", generate_bestreleases.email);
	//	Create a root user if not exists otherwise update it
	try {
		console.log("Generate_bestreleases");
		const root_parameters = {	
			uuid    : "00000000-0000-0000-0000-000000000000",
			email   : "root@mail.com",
			role    : "admin",
			verified: true,
			homeid  : "id",
            release_image1 : "release_image1",
            release_name1 : "release_name1",
            release_image2 : "release_image2",
            release_name2 : "release_name2",
            release_image3 : "release_image3",
            release_name3 : "release_name3",
            release_image4 : "release_image4",
            release_name4 : "release_name4"
		};
		//	Find for existing account with the same id, create or update
		var account = await ModelBestReleases.findOne({where: { "email": root_parameters.email }});
		
		account = await ((account) ? account.update(root_parameters): ModelBestReleases.create(root_parameters));
		
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
 async function generate_rooms(database, options) {
	//	Remove this callback to ensure it runs only once
	database.removeHook("afterBulkSync", generate_rooms.email);
	//	Create a root user if not exists otherwise update it
	try {
		console.log("Generate_rooms");
		const root_parameters = {	
			uuid    		: "00000000-0000-0000-0000-000000000000",
			email   		: "root@mail.com",
			role    		: "admin",
			verified		: true,
            prodlistid		: "prodlistid",
            room_title 		: generate_rooms.room_title,
            small_roominfo 	: generate_rooms.small_roominfo,
            small_roomprice : generate_rooms.small_roomprice,
            small_roomimage1: generate_rooms.small_roomimage1,
            small_roomimage2: generate_rooms.small_roomimage2,

            med_roominfo 	: generate_rooms.med_roominfo,
            med_roomprice 	: generate_rooms.med_roomprice,
            med_roomimage 	: generate_rooms.med_roomimage,

            large_roominfo 	: generate_rooms.large_roominfo,
            large_roomprice : generate_rooms.large_roomprice,
            large_roomimage1: generate_rooms.large_roomimage1,
            large_roomimage2: generate_rooms.large_roomimage2
		};
		//	Find for existing account with the same id, create or update
		var account = await ModelRooms.findOne({where: { "email": root_parameters.email }});
		
		account = await ((account) ? account.update(root_parameters): ModelRooms.create(root_parameters));
		
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
	database.removeHook("afterBulkSync", generate_movies.email);
	//	Create a root user if not exists otherwise update it
	try {
		console.log("Generate_movies");
		const root_parameters = {	
			uuid    		: generate_movies.uuid,
			email   		: "root@mail.com",
			role    		: "admin",
			verified		: true,
            prodlistid		: "prodlistid",
			choosemovieid	: "choosemovieid",

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
		var account = await ModelMovies.findOne({where: { "email": root_parameters.email }});
		
		account = await ((account) ? account.update(root_parameters): ModelMovies.create(root_parameters));
		
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
 async function generate_songs(database, options) {
	//	Remove this callback to ensure it runs only once
	database.removeHook("afterBulkSync", generate_songs.email);
	//	Create a root user if not exists otherwise update it
	try {
		console.log("Generate_songs");
		const root_parameters = {	
			uuid    		: "00000000-0000-0000-0000-000000000000",
			email   		: "root@mail.com",
			role    		: "admin",
			verified		: true,
            prodlistid		: "prodlistid",
			choosekaraokeid	: "choosekaraokeid",

            songimage		: "songimage",
            songname		: "songname",
            songagerating	: "songagerating",
            songduration	: "songduration",

            songPop			: "songPop",
            songRock		: "songRock",
            songMetal		: "songMetal",
        	songCountry		: "songCountry",
            songRap			: "songRap",
            songElectronic	: "songElectronic",
            songJazz		: "songJazz",
            songFolk		: "songFolk"
		};
		//	Find for existing account with the same id, create or update
		var account = await ModelSongs.findOne({where: { "email": root_parameters.email }});
		
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


/**
 * This function creates a root account 
 * @param {Sequelize} database Database ORM handle
 * @param {SyncOptions} options Synchronization options, not used
 */
async function generate_checkout(database, options) {
	//	Remove this callback to ensure it runs only once
	database.removeHook("afterBulkSync", generate_checkout.uuid);
	//	Create a root user if not exists otherwise update it
	try {
		console.log("Generate_checkout");
		const root_parameters = {
			uuid: "00000000-0000-0000-0000-000000000000",
			username: "mark_tan_1234",
			card_number: "123456",
			card_holder: "Mark tan",
			expiry_month: "2",
			expiry_year: "24",
			ccv: "123",
		};
		//	Find for existing account with the same id, create or update
		var account = await ModelCheckout.findOne({ where: { "uuid": root_parameters.uuid } });

		account = await ((account) ? account.update(root_parameters) : ModelCheckout.create(root_parameters));

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
async function generate_roomtype(database, options) {
	//	Remove this callback to ensure it runs only once
	database.removeHook("afterBulkSync", generate_roomtype.uuid);
	//	Create a root user if not exists otherwise update it
	try {
		console.log("Generate_roomtype");
		const root_parameters = {
			uuid: "00000000-0000-0000-0000-000000000000",
			location: "bishan",
			time: "9am",
			date: "17th May 2021",
			small: 5,
			medium: 5,
			big: 5
		};
		//	Find for existing account with the same id, create or update
		var account = await ModelRoomtype.findOne({ where: { "uuid": root_parameters.uuid } });

		account = await ((account) ? account.update(root_parameters) : ModelRoomtype.create(root_parameters));

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

