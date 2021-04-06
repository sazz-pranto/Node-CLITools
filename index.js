const fs = require('fs');  // fs contains all the funcitons related to file systems
const util = require('util');
const chalk = require('chalk');
// const path = require('path'); 

// const targetDir = process.argv[2] || process.cwd();

// METHOD 1, 2, 3 DOES THE EXACT SAME THING IN 3 DIFFERENT WAYS (METHOD 2 IS THE DETAILED VERSION)
// method 1
// const lstat = util.promisify(fs.lstat);

//method 2
const lstat = (filename) => {
    return new Promise((resolve, reject) => {
        fs.lstat(filename, (err, stat) => {
            if(err) reject(err); else resolve(stat);
        });
    });
};

//method 3
// const { lstat } = fs.promises;

// to read the files of a directory
// process.cwd() figures out where the program is executed from (cwd->current working directory)
fs.readdir(process.cwd(), async (err, filenames) => {
    if(err) {
        console.log(err);
    }
    
    // bad approach to show stats for each file,
    //each iteration works on individual file using await, would take a lot of time for large number of files
    // for(let filename of filenames) {
    //     try {
    //         const stat = await lstat(filename);
    //         console.log(filename, stat.isFile());
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }

    // good approach=>
    /* storing stats for each file, each stat is found using fs.lstat() in a promise based approach
    map helps storing all the promises in an array */
    const statPromises = filenames.map((filename) => {
        // return lstat(path.join(targetDir, filename));  // use this if targetDir is used
        return lstat(filename);
    });
    const allStats = await Promise.all(statPromises); // Promise.all to handle all the promises in a parallel way to save time

    //iterate through all the file stats
    for(let stats of allStats) {
        let index = allStats.indexOf(stats);
        // using chalk to distinguish files and folders
        if(stats.isFile()) {
            console.log(filenames[index]);
        } else {
            console.log(chalk.red(filenames[index]));
        }
    }
    // noob approach=>
    // const allStats = Array(filenames.length).fill(null);
    // for (let filename of filenames) {
    //     const index = filenames.indexOf(filename);

    //     fs.lstat(filename, (err, stats) => {
    //         if (err) {
    //             console.log(err);
    //         }
        
    //         allStats[index] = stats;
        
    //         /* The every() method tests whether all elements in the array pass
    //         the test implemented by the provided function. It returns a Boolean value. */
    //         const ready = allStats.every(stats => {
    //             return stats;
    //         });
        
    //         if (ready) {
    //             allStats.forEach((stats, index) => {
    //             console.log(filenames[index], stats.isFile());
    //             });
    //         }
    //     });
    // }
});