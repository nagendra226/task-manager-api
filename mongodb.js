//CREATE READ UPDATE DELETE

// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;
// //To create ObjectID
// //const ObjectID = mongodb.ObjectID;

//destructing syntax
const { MongoClient, ObjectID } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databseName = 'task-manager';

//Create ObjectID
const id = new ObjectID();

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (error, client) => {
    if (error) {
      return console.log('Unable to connect to database');
    }
    console.log('connected correctly');
    const db = client.db(databseName);

    //async operation
    /* ------------------------------- Insert One users with ID collection ------------------------------ */
    // db.collection('users').insertOne(
    //   {
    //     _id: id.getTimestamp(),
    //     name: 'Praveen',
    //     age: '25',
    //   },
    //   (error, result) => {
    //     error ? console.log('unable to insert use') : null;

    //     //array of documents
    //     console.log(result.ops);
    //   }
    // );

    //async operation
    /* ------------------------------- Insert One users collection ------------------------------ */
    // db.collection('users').insertOne(
    //   {
    //     name: 'Praveen',
    //     age: '25',
    //   },
    //   (error, result) => {
    //     error ? console.log('unable to insert use') : null;

    //     //array of documents
    //     console.log(result.ops);
    //   }
    // );

    /* ------------------------------- Insert Many users collection ------------------------------ */
    // db.collection('users').insertMany(
    //   [
    //     { name: 'Nitesh', age: '37' },
    //     { name: 'Sathya', age: '38' },
    //   ],
    //   (error, result) => {
    //     error ? console.log('unable to use insert') : null;
    //     console.log(result.ops);
    //   }
    // );
    /* ------------------------------- Insert Many tasks collection ------------------------------ */
    // db.collection('tasks').insertMany(
    //   [
    //     { description: 'learning nodejs', isCompleted: false },
    //     { description: 'learning react js', isCompleted: false },
    //     { description: 'learning Python', isCompleted: true },
    //     { description: 'Endeavor Testing and coding', isCompleted: true },
    //     { description: 'Tetra Retrofit', isCompleted: false },
    //   ],
    //   (error, result) => {
    //     // error?console.log('unable to use insert Many Operation') : null

    //     if (error) {
    //       return console.log('Unable to use insertMany operation');
    //     }

    //     console.log(result.ops);
    //   }
    // );
    /* ------------------------------- Find One users collection ------------------------------ */
    // db.collection('users').findOne(
    //   { _id: new ObjectID('5ecc96c883d0920730e557b9') },
    //   (error, user) => {
    //     if (error) {
    //       return console.log('unable to fetch');
    //     }
    //     console.log(user);
    //   }
    // );
    /* ------------------------------- Find Many users collection ------------------------------ */
    // db.collection('users').find({age: "25"}).toArray(
    //   (error, user) => {
    //     if (error) {
    //       return console.log('unable to fetch');
    //     }
    //     console.log(user);
    //   }
    // );
    /* ------------------------------- Find One tasks collection ------------------------------ */
    // db.collection('tasks').findOne(
    //   { _id: new ObjectID('5ecca201a65b172a68ebc483') },
    //   (error, task) => {
    //     if (error) {
    //       return console.log('unable to fetch');
    //     }
    //     console.log(task);
    //   }
    // );
    /* ------------------------------- Find Many tasks collection To Array ------------------------------ */
    // db.collection('tasks').find({isCompleted:false}).toArray(
    //     (error,task) => {
    //         if(error){
    //             return console.log("Unable to fetch");
    //         }
    //         console.log(task);
    //     }
    // );
    // db.collection('tasks').find({isCompleted:false}).count(
    //     (error,number) => {
    //         if(error){
    //             return console.log("Unable to fetch");
    //         }
    //         console.log(number);
    //     }
    // );
    /* ------------------------------- UpdateOne user using set------------------------------ */
    // db.collection('users')
    //   .updateOne(
    //     { _id: new ObjectID('5ecca019dbcef321a86dace0') },
    //     { $set: { age: 38 }}
    //   )
    //   .then((result) => {
    //     console.log(result.modifiedCount);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    /* ------------------------------- UpdateOne user using inc------------------------------ */
    // db.collection('users')
    //   .updateOne(
    //     { _id: new ObjectID('5ecca019dbcef321a86dace0') },
    //     { $inc: { age: 2 } }
    //   )
    //   .then((result) => {
    //     console.log(result.modifiedCount);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    /* ------------------------------- UpdateMany task using set & inc ------------------------------ */
    // db.collection('tasks')
    //   .updateMany({ isCompleted: false }, { $set: { isCompleted: true } })
    //   .then((result) => {
    //     console.log(result.modifiedCount);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    /* ------------------------------- DeleteMany user collection ------------------------------ */
    // db.collection('users')
    //   .deleteMany({ age: "25" })
    //   .then((result) => console.log(result.deletedCount))
    //   .catch((error) => console.log(error));
    /* ------------------------------- DeleteOne task collection ------------------------------ */
    db.collection('tasks')
      .deleteOne({ description: 'Endeavor Testing and coding' })
      .then((result) => console.log(result.deletedCount))
      .catch((error) => console.log(error));
  }
);
