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
    pregunta();
});


function pregunta() {
    inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case "View Products for Sale":
        viewProducts();
        break;

      case "View Low Inventory":
        lowInventory();
        break;

      case "Add to Inventory":
        addInventory();
        break;

      case "Add New Product":
        newProduct();
        break;
      }
function viewProducts(){
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
pregunta();
    });

}

function lowInventory(){
    var table = new Table({
        head: ['ID', 'Product Name', 'Price', 'Stock']
        , colWidths: [15, 15, 15, 15]
    });
    connection.query("SELECT * FROM products WHERE stock_cuantity<5", function (err, res) {
        if (err) throw err;
        console.log("            PRODUCTS WITH LOW INVENTORY");
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].ITEM_ID, res[i].product_name, res[i].price, res[i].stock_cuantity]
            );
        }
        console.log(table.toString());
pregunta();
    });
}

function addInventory(){
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
        inquirer
        .prompt([
            {
                name: "id",
                type: "input",
                message: "ID of product you want to INCREASE INVENTORY?"

            },
            {
                name: "quantity",
                type: "input",
                message: "How many products you want to INCREASE THE INVENTORY?"

            }
        ])
        .then(function (answer) {
            connection.query("SELECT * FROM products WHERE ITEM_ID = ?", [answer.id], function (err, res) {
       
                    var cantidadnueva= res[0].stock_cuantity+parseInt(answer.quantity);
                    var ID=res[0].ITEM_ID; 
                    connection.query("UPDATE products set stock_cuantity=? where ITEM_ID=?", [cantidadnueva,ID])
                    pregunta();

                
                

            });
        });
    });
}

function newProduct(){
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
        inquirer
        .prompt([
            {
                name: "productName",
                type: "input",
                message: "Name of the product you want to add"

            },
            {
                name: "department",
                type: "input",
                message: "Department in which the Product is Classiffied"

            },
            {
                name: "price",
                type: "input",
                message: "Price of the Product"

            },
            {
                name: "quantity",
                type: "input",
                message: "With how many products you want to inicialize the product?"

            }
        ])
        .then(function (answer) {
            connection.query(
                "INSERT INTO products SET ?",
                {
                  product_name: answer.productName,
                  department_name: answer.department,
                  price: answer.price,
                  stock_cuantity: answer.quantity
                },
                function(err) {
                  if (err) throw err;
                  console.log("Your auction was created successfully!");
                  // re-prompt the user for if they want to bid or post
                  pregunta();
                }
              );
        });
    });

}

    });








}
