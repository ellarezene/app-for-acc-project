// =====================================================
// ACCOUNTING SYSTEM
// =====================================================


// =====================================================
// DATA
// =====================================================

let customers = [];
let products = [];
let sales = [];
let expenses = [];


// =====================================================
// DOM ELEMENTS
// =====================================================

// Customers
const customerForm = document.getElementById("customer-form");
const customerName = document.getElementById("customer-name");
const customersList = document.getElementById("customers-list");

// Products
const productForm = document.getElementById("product-form");
const productName = document.getElementById("product-name");
const buyingPrice = document.getElementById("buying-price");
const sellingPrice = document.getElementById("selling-price");
const productQuantity = document.getElementById("product-quantity");
const productsList = document.getElementById("products-list");

// Sales
const salesForm = document.getElementById("sales-form");
const saleCustomer = document.getElementById("sale-customer");
const saleProduct = document.getElementById("sale-product");
const saleQuantity = document.getElementById("sale-quantity");
const saleTotal = document.getElementById("sale-total");
const salesList = document.getElementById("sales-list");

// Expenses
const expenseForm = document.getElementById("expense-form");
const expenseName = document.getElementById("expense-name");
const expenseCategory = document.getElementById("expense-category");
const expenseAmount = document.getElementById("expense-amount");
const expenseDate = document.getElementById("expense-date");
const expensesList = document.getElementById("expenses-list");

// Dashboard
const totalSalesElement = document.getElementById("total-sales");
const totalExpensesElement = document.getElementById("total-expenses");
const totalProfitElement = document.getElementById("total-profit");


// =====================================================
// LOCALSTORAGE
// =====================================================

function saveData() {

    localStorage.setItem(
        "customers",
        JSON.stringify(customers)
    );

    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );

    localStorage.setItem(
        "sales",
        JSON.stringify(sales)
    );

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );
}


function loadData() {

    const savedCustomers =
        localStorage.getItem("customers");

    const savedProducts =
        localStorage.getItem("products");

    const savedSales =
        localStorage.getItem("sales");

    const savedExpenses =
        localStorage.getItem("expenses");


    if (savedCustomers) {
        customers = JSON.parse(savedCustomers);
    }

    if (savedProducts) {
        products = JSON.parse(savedProducts);
    }

    if (savedSales) {
        sales = JSON.parse(savedSales);
    }

    if (savedExpenses) {
        expenses = JSON.parse(savedExpenses);
    }
}


// =====================================================
// CUSTOMERS
// =====================================================

// Add customer

customerForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = customerName.value.trim();

    if (name === "") {
        return;
    }

    const customer = {
        id: Date.now(),
        name: name
    };

    customers.push(customer);

    customerName.value = "";

    displayCustomers();

    populateSalesOptions();

    saveData();
});


// Display customers

function displayCustomers() {

    customersList.innerHTML = "";

    customers.forEach(function(customer) {

        const customerDiv =
            document.createElement("div");

        customerDiv.innerHTML = `
            <p>
                <strong>${customer.name}</strong>
            </p>

            <button onclick="editCustomer(${customer.id})">
                Edit
            </button>

            <button onclick="deleteCustomer(${customer.id})">
                Delete
            </button>
        `;

        customersList.appendChild(customerDiv);
    });
}


// Edit customer

function editCustomer(id) {

    const customer = customers.find(function(customer) {
        return customer.id === id;
    });

    if (!customer) {
        return;
    }

    const newName = prompt(
        "Enter new customer name:",
        customer.name
    );

    if (
        newName !== null &&
        newName.trim() !== ""
    ) {

        customer.name = newName.trim();

        displayCustomers();

        populateSalesOptions();

        saveData();
    }
}


// Delete customer

function deleteCustomer(id) {

    customers = customers.filter(function(customer) {
        return customer.id !== id;
    });

    displayCustomers();

    populateSalesOptions();

    saveData();
}


// =====================================================
// PRODUCTS
// =====================================================

// Add product

productForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = productName.value.trim();

    const buying = Number(
        buyingPrice.value
    );

    const selling = Number(
        sellingPrice.value
    );

    const quantity = Number(
        productQuantity.value
    );


    if (
        name === "" ||
        buying <= 0 ||
        selling <= 0 ||
        quantity <= 0
    ) {
        return;
    }


    const product = {

        id: Date.now(),

        name: name,

        buyingPrice: buying,

        sellingPrice: selling,

        quantity: quantity
    };


    products.push(product);


    productName.value = "";

    buyingPrice.value = "";

    sellingPrice.value = "";

    productQuantity.value = "";


    displayProducts();

    populateSalesOptions();

    saveData();
});


// Display products

function displayProducts() {

    productsList.innerHTML = "";

    products.forEach(function(product) {

        const productDiv =
            document.createElement("div");


        productDiv.innerHTML = `

            <p>
                <strong>${product.name}</strong>
            </p>

            <p>
                Buying Price:
                ${product.buyingPrice}
            </p>

            <p>
                Selling Price:
                ${product.sellingPrice}
            </p>

            <p>
                Quantity:
                ${product.quantity}
            </p>

            <button onclick="editProduct(${product.id})">
                Edit
            </button>

            <button onclick="deleteProduct(${product.id})">
                Delete
            </button>

        `;


        productsList.appendChild(productDiv);
    });
}


// Edit product

function editProduct(id) {

    const product = products.find(function(product) {
        return product.id === id;
    });


    if (!product) {
        return;
    }


    const newName = prompt(
        "Enter new product name:",
        product.name
    );


    const newBuyingPrice = prompt(
        "Enter new buying price:",
        product.buyingPrice
    );


    const newSellingPrice = prompt(
        "Enter new selling price:",
        product.sellingPrice
    );


    const newQuantity = prompt(
        "Enter new quantity:",
        product.quantity
    );


    if (
        newName !== null &&
        newName.trim() !== ""
    ) {

        product.name = newName.trim();
    }


    if (
        newBuyingPrice !== null &&
        Number(newBuyingPrice) > 0
    ) {

        product.buyingPrice =
            Number(newBuyingPrice);
    }


    if (
        newSellingPrice !== null &&
        Number(newSellingPrice) > 0
    ) {

        product.sellingPrice =
            Number(newSellingPrice);
    }


    if (
        newQuantity !== null &&
        Number(newQuantity) >= 0
    ) {

        product.quantity =
            Number(newQuantity);
    }


    displayProducts();

    populateSalesOptions();

    saveData();
}


// Delete product

function deleteProduct(id) {

    products = products.filter(function(product) {
        return product.id !== id;
    });

    displayProducts();

    populateSalesOptions();

    saveData();
}


// =====================================================
// SALES
// =====================================================

// Populate customer and product dropdowns

function populateSalesOptions() {

    // Customers

    saleCustomer.innerHTML = `
        <option value="">
            Select Customer
        </option>
    `;


    customers.forEach(function(customer) {

        const option =
            document.createElement("option");

        option.value = customer.id;

        option.textContent = customer.name;

        saleCustomer.appendChild(option);
    });


    // Products

    saleProduct.innerHTML = `
        <option value="">
            Select Product
        </option>
    `;


    products.forEach(function(product) {

        const option =
            document.createElement("option");

        option.value = product.id;

        option.textContent =
            `${product.name} (${product.quantity} available)`;

        saleProduct.appendChild(option);
    });
}


// Calculate sale total

function calculateSaleTotal() {

    const productId =
        Number(saleProduct.value);


    const product = products.find(function(product) {

        return product.id === productId;

    });


    if (!product) {

        saleTotal.textContent = "0";

        return;
    }


    const quantity =
        Number(saleQuantity.value);


    if (quantity <= 0) {

        saleTotal.textContent = "0";

        return;
    }


    const total =
        product.sellingPrice * quantity;


    saleTotal.textContent = total;
}


// Product change

saleProduct.addEventListener(
    "change",
    function() {

        calculateSaleTotal();

    }
);


// Quantity change

saleQuantity.addEventListener(
    "input",
    function() {

        calculateSaleTotal();

    }
);


// Record sale

salesForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const customerId =
            Number(saleCustomer.value);


        const productId =
            Number(saleProduct.value);


        const quantity =
            Number(saleQuantity.value);


        const customer =
            customers.find(function(customer) {

                return customer.id === customerId;

            });


        const product =
            products.find(function(product) {

                return product.id === productId;

            });


        if (!customer || !product) {

            return;
        }


        if (quantity <= 0) {

            return;
        }


        if (quantity > product.quantity) {

            alert("Not enough stock available.");

            return;
        }


        const total =
            product.sellingPrice * quantity;


        const sale = {

            id: Date.now(),

            customerId:
                customer.id,

            productId:
                product.id,

            quantity:
                quantity,

            total:
                total
        };


        sales.push(sale);


        // Decrease stock

        product.quantity =
            product.quantity - quantity;


        // Clear form

        saleCustomer.value = "";

        saleProduct.value = "";

        saleQuantity.value = "";

        saleTotal.textContent = "0";


        displaySales();

        displayProducts();

        populateSalesOptions();

        updateDashboard();

        saveData();

    }
);


// Display sales

function displaySales() {

    salesList.innerHTML = "";


    sales.forEach(function(sale) {


        const customer =
            customers.find(function(customer) {

                return customer.id === sale.customerId;

            });


        const product =
            products.find(function(product) {

                return product.id === sale.productId;

            });


        const saleDiv =
            document.createElement("div");


        saleDiv.innerHTML = `

            <p>
                Customer:
                ${customer ? customer.name : "Unknown"}
            </p>

            <p>
                Product:
                ${product ? product.name : "Unknown"}
            </p>

            <p>
                Quantity:
                ${sale.quantity}
            </p>

            <p>
                Total:
                ${sale.total}
            </p>

        `;


        salesList.appendChild(saleDiv);

    });
}


// =====================================================
// EXPENSES
// =====================================================

// Add expense

expenseForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const name =
            expenseName.value.trim();


        const category =
            expenseCategory.value.trim();


        const amount =
            Number(expenseAmount.value);


        const date =
            expenseDate.value;


        if (
            name === "" ||
            category === "" ||
            amount <= 0 ||
            date === ""
        ) {

            return;
        }


        const expense = {

            id: Date.now(),

            name:
                name,

            category:
                category,

            amount:
                amount,

            date:
                date
        };


        expenses.push(expense);


        // Clear form

        expenseName.value = "";

        expenseCategory.value = "";

        expenseAmount.value = "";

        expenseDate.value = "";


        displayExpenses();

        updateDashboard();

        saveData();

    }
);


// Display expenses

function displayExpenses() {

    expensesList.innerHTML = "";


    expenses.forEach(function(expense) {

        const expenseDiv =
            document.createElement("div");


        expenseDiv.innerHTML = `

            <p>
                <strong>${expense.name}</strong>
            </p>

            <p>
                Category:
                ${expense.category}
            </p>

            <p>
                Amount:
                ${expense.amount}
            </p>

            <p>
                Date:
                ${expense.date}
            </p>

        `;


        expensesList.appendChild(expenseDiv);

    });
}


// =====================================================
// DASHBOARD
// =====================================================

function updateDashboard() {

    // Total Sales

    let totalSales = 0;


    sales.forEach(function(sale) {

        totalSales =
            totalSales + sale.total;

    });


    // Total Expenses

    let totalExpenses = 0;


    expenses.forEach(function(expense) {

        totalExpenses =
            totalExpenses + expense.amount;

    });


    // Profit

    const totalProfit =
        totalSales - totalExpenses;


    // Display

    totalSalesElement.textContent =
        totalSales;


    totalExpensesElement.textContent =
        totalExpenses;


    totalProfitElement.textContent =
        totalProfit;
}


// =====================================================
// START APPLICATION
// =====================================================

loadData();

displayCustomers();

displayProducts();

displaySales();

displayExpenses();

populateSalesOptions();

updateDashboard();