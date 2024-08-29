const express = require('express');
const mysql = require("mysql2/promise");
const { Sequelize, DataTypes } = require("sequelize");

// const debugRouter = require('./routes/debugRoute');

const app = express();
app.use(express.json());

// function init connection mysql
let conn = null;
const initMySQL = async () => {
    conn = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "appdev",
        database: "appdev",
    });
};

// Use sequenlize 
// dialect: /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */

//*************************************************************************************************
// mysql 
//*************************************************************************************************
let database = "appdev";
let username = "root";
let password = "appdev";
const sequelize = new Sequelize(database, username, password, {
    host: "localhost",
    dialect: "mysql",    
});

//*************************************************************************************************
// postgres
//*************************************************************************************************
/*
let database = "appdev";
let username = "appdev";
let password = "appdev";
const sequelize = new Sequelize(database, username, password, {
    host: "localhost",
    dialect: "postgres",    
});
*/

//*************************************************************************************************
// mssql
//*************************************************************************************************
/*
let database = "TEST.FREEZONE";
let username = "CBI";
let password = "MLae7y7Ge1WO";
const sequelize = new Sequelize(database, username, password, {
    host: "192.168.10.2",
    dialect: "mssql",    
});
*/

const User = sequelize.define(
    "users",
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            valipublishDate: {
                isEmail: true,
            },
        },
    },
    {},
);

const Address = sequelize.define(
    "addresses",
    {
        address1: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {},
);

// ประกาศ relation แบบปกติ
//User.hasMany(Address)

// relation แบบผูกติด (จะสามารถลบไปพร้อมกันได้) = พิจารณาเป็น case by case ไป
User.hasMany(Address, { onDelete: "CASCADE" });

Address.belongsTo(User);




app.get("/api/users", async (req, res) => {
    try {
        // แบบ Query แบบเก่า
        //const [result] = await conn.query('SELECT * from users')

        // query ผ่าน model แทน
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        //console.error(err);
        res.json(err);
    }
});

app.post("/api/user", async (req, res) => {
    try {
        const data = req.body;
        // แบบ Query แบบเก่า
        // const [result] = await conn.query('INSERT INTO users SET ?', data)

        // ท่า Model
        //data.createdAt = new Date();
        //data.updatedAt = new Date();
        const user = await User.create(data);
        //res.json(user);

        const addressData = data.addresses;
        let addressCreated = [];
        for (let i = 0; i < addressData.length; i++) {
            let cAddressData = addressData[i];            
            cAddressData.userId = user.id;
            const address = await Address.create(cAddressData);
            addressCreated.push(address);
        }

        res.json({ user, addresses: addressCreated });        
    } catch (err) {
        console.error(err);
        res.json({
            message: "something went wrong",
            error: err.errors.map((e) => e.message),
        });
    }
});

app.get("/api/users/:id/address", async (req, res) => {
    try {
        const userId = req.params.id;
        // แบบ Query แบบเก่า
        // const [result] = await conn.query('SELECT users.*, addresses.address1 FROM users LEFT JOIN addresses on users.id = addresses.userId WHERE users.id = ?', userId)

        const result = await User.findAll({
            where: { id: userId },
            include: {
                model: Address,
            },
            raw: true,
        });

        res.json(result);
    } catch (err) {
        console.error(err);
        res.json(err);
    }
});

app.put("/api/users/:id", async (req, res) => {
    try {
        const data = req.body;
        const userId = req.params.id;
        // แบบ Query แบบเก่า
        // const result = await conn.query('UPDATE users SET ? WHERE id = ?', [data, id])

        // ท่า Model
        const users = await User.update(
            {
                name: data.name,
                email: data.email,
            },
            {
                where: { id: userId },
            },
        );

        // ใช้ upsert (insert or update) สำหรับการใส่ข้อมูล
        for (let i = 0; i < data.addresses.length; i++) {
            let cAddressData = data.addresses[i];
            console.log("cAddressData : ", cAddressData);
            cAddressData.userId = userId;
            const address = await Address.upsert(cAddressData);
        }

        // [2] ใช้ if, else แยกเคส ซึ่ง upsert มีค่าเทียบเท่ากับท่าล่างนี้
        // for (let i = 0; i < data.addresses.length; i++) {
        //   const updateAddress = data.addresses[i]
        //   const updateObj = {}

        //   if (updateAddress.id) {
        //     await Address.update({
        //       address1: updateAddress.address1
        //     }, {
        //       where: {
        //         id: updateAddress.id,
        //         userId // userId: userId
        //       }
        //     })
        //   } else {
        //     await Address.create({
        //       ...updateAddress,
        //       userId
        //     })
        //   }
        // }

        res.json({
            message: "update complete!",
            users,
        });
    } catch (err) {
        console.error(err);
        res.json({
            message: "something went wrong",
            error: err.errors.map((e) => e.message),
        });
    }
});

app.delete("/api/users/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        // แบบ Query แบบเก่า
        // const [result] = await conn.query('DELETE FROM users WHERE id = ?', [id])

        // query ผ่าน model แทน
        const result = await User.destroy({
            where: { id: userId },
        });

        res.json({
            message: "delete successful",
            result,
        });
    } catch (err) {
        console.error(err);
        res.json(err);
    }
});

// async function getUsers() {
//     var response = [];
//     try {
//         response = await fetch("https://669890d82069c438cd6f2242.mockapi.io/userInfo");
//         if (!response.ok) {
//             throw new Error('Cannot fetch users data.');
//         }
//         return response.json();
//     } catch (error) {
//         //console.log('Error : ', error);
//         return res.status(400).send({ error: error.message });
//     }
// }

// app.get('/api/users', /*cors(corsOptionsDelegate),*/ async (req, res) => {
//     const users = await getUsers();
//     return res.send(users);
// });

const port = process.env.port || 8081;
app.listen(port, async () => {
    await sequelize.sync();
    //await sequelize.sync({ force: true });

    console.log('Listening on port ' + port + ' : http://localhost:' + port + '/api/users')
});