const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let db;

const initiliazeDb = async (uri) => {

    if (!db) {
        db = await mongoose.connect(uri, {
            useNewUrlParser: true,
        });
        console.log('Database is connected!');
    }
}

module.exports = {
    initiliazeDb,
};
