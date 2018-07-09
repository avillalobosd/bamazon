var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');



var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    mostrarProductos();
});

function mostrarProductos() {
    var table = new Table({
        head: ['ID', 'Product Name', 'Price', 'Stock']
        , colWidths: [15, 15, 15, 15]
    });
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("               AVAILABLE PRODUCTS");
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].ITEM_ID, res[i].product_name, res[i].price, res[i].stock_cuantity]
            );
        }
        console.log(table.toString());
        buy();
    });
}

function buy() {
    inquirer
        .prompt([
            {
                name: "id",
                type: "input",
                message: "ID of product you want to buy?"

            },
            {
                name: "quantity",
                type: "input",
                message: "How many products you want to buy?"

            }
        ])
        .then(function (answer) {
            connection.query("SELECT * FROM products WHERE ITEM_ID = ?", [answer.id], function (err, res) {
                if (res[0].stock_cuantity >= answer.quantity) {
                    var cantidadnueva= res[0].stock_cuantity-answer.quantity;
                    var ID=res[0].ITEM_ID;
                    console.log("Enough products in stock");
                    connection.query("UPDATE products set stock_cuantity=? where ITEM_ID=?", [cantidadnueva,ID])
                    console.log("Products reduced from stock and shipped");
                    mostrarProductos();

                }
                else {
                    console.log("No hay suficiente producto en stock");
                    mostrarProductos();
                }

            });
        });








}
