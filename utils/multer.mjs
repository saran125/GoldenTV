import multer  from 'multer';
import fs from 'fs';
import path    from 'path';

var storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, './public/uploads/');
	},
	filename: (req, file, callback) => {
		// req.body.file = filename
		callback(null, Date.now() + file.originalname);
	}
});

// this code goes inside the object passed to multer()
export function fileFilter (req, file, cb) {    
	// Allowed ext
	const filetypes = /jpeg|jpg|png|webp/;
    // Check ext
	const extname =  filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

   if(mimetype && extname){
	   return cb(null,true);
   } else {
		cb('404');
		// return res.render('404');
   }
  }

export const upload = multer({ 
	storage: storage,
	limits : {fileSize : 1000000},
	fileFilter : fileFilter
});

// /**
//  * Function to delete a uploaded file
//  * @param files {...string}
// **/
// export function DeleteFilePath(...files) {
// 	for (let file of files) {
// 		if (FileSys.existsSync(file)) {
// 			console.log(`Removing from server: ${file}`);
// 			return FileSys.unlinkSync(file);
// 		}
// 		else
// 			console.warn(`Attempting to delete non-existing file(s) ${file}`);
// 	}
// } 