
/********************************************************************************
*  WEB322 – Assignment 04
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Hengmin Tsao Student ID: 166494229 Date: 14 JUL 2024
*
*  Published URL: https://web-322-assignment4.vercel.app/
*
********************************************************************************/



const express = require('express');
const legoData = require("./modules/legoSets");
const path = require('path');
const port = process.env.PORT || 3000;

const app = express();

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));

app.get('/css/main.css',(req,res)=>{
    res.sendFile(path.join(__dirname,'public/css/main.css'));
})

legoData.Initialize()
    .then(() => {
        console.log("Initialize successfully...");

        // GET "/"
        app.get('/', (req, res) => {
            res.render("home");
            //res.sendFile(path.join(__dirname, "views/home.html"));
        });

        
        app.get('/about', (req, res) => {
            res.render("about",{page: "/about"});
            //res.sendFile(path.join(__dirname, "views/about.html"));
        });

        
        
        app.get('/lego/sets', (req, res) => {
            
            const theme = req.query.theme;
            if (theme) {
                legoData.getSetsByTheme(theme) // show the specific theme
                .then(sets => {
                    if (sets.length > 0) {
                        res.render("sets", { sets: sets });
                    } else {
                        res.status(404).render("404", { message: "No sets found for the specified theme." });
                    }
                })
                .catch(err => {
                    console.error(err);
                    res.status(404).render("404", { message: "No sets found for the specified theme." });
                });
            } else {
                legoData.getAllSets()
                    .then(sets => {
                        if (sets.length > 0) {
                            res.render("sets", { sets: sets });
                        } else {
                            res.status(404).render("404", { message: "No sets found." });
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(404).render("404", { message: "No sets found for the specified theme." });
                    });
            }
        });

        app.get('/lego/sets/:set_num', (req, res) => {
            
            const setNum = req.params.set_num;
            legoData.getSetByNum(setNum)
                .then(set => {
                    if (set) {
                        res.render("set", { set: set });
                    } else {
                        res.status(404).render("404", { message: "Set number not found." });
                    }
                })
                .catch(err => {
                    console.error(err);
                });
        });
        

        
        app.use((req, res) => {
            res.status(404).render("404", { message: "The page you are looking for cannot be found." });
            //res.status(404).sendFile(path.join(__dirname, "views/404.html"));
        });

    })
    .catch(err => {
        console.error("Initialization failed: ", err);
    });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});




