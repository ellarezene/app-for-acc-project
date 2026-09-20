// =========================
// ACCOUNTING SYSTEM
// =========================

function loadArray(key) {
    try {
        const value = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(value) ? value : [];
    } catch (error) {
        // Ignore damaged old data instead of stopping the whole application.
        localStorage.removeItem(key);
        return [];
    }
}

let products = loadArray("products");
let sales = loadArray("sales");
let expenses = loadArray("expenses");

function loadDashboardTotals() {
    try {
        const savedTotals = JSON.parse(localStorage.getItem("dashboardTotals"));

        if (savedTotals) {
            return savedTotals;
        }
    } catch (error) {
        localStorage.removeItem("dashboardTotals");
    }

    return {
        totalSales: sales.reduce(function (total, sale) {
            return total + (Number(sale.total) || 0);
        }, 0),
        totalExpenses: expenses.reduce(function (total, expense) {
            return total + (Number(expense.amount) || 0);
        }, 0),
        totalBuyingCost: sales.reduce(function (total, sale) {
            return total + (Number(sale.buyingCost) || 0);
        }, 0),
        totalProducts: products.length,
        salesCount: sales.length,
        lowStock: products.filter(function (product) {
            return Number(product.quantity) <= 5;
        }).length
    };
}

let dashboardTotals = loadDashboardTotals();

// Values saved in localStorage may come back as strings. Normalize them before
// doing calculations, otherwise addition can concatenate values instead.
products = products.map(function (product) {
    return {
        ...product,
        buyingPrice: Number(product.buyingPrice) || 0,
        sellingPrice: Number(product.sellingPrice) || 0,
        quantity: Number(product.quantity) || 0
    };
});

sales = sales.map(function (sale) {
    return {
        ...sale,
        quantity: Number(sale.quantity) || 0,
        total: Number(sale.total) || 0,
        buyingCost: Number(sale.buyingCost) || 0
    };
});

expenses = expenses.map(function (expense) {
    return {
        ...expense,
        amount: Number(expense.amount) || 0
    };
});

const productForm = document.getElementById("product-form");
const productsList = document.getElementById("products-list");
const productSubmitButton = productForm.querySelector('button[type="submit"]');
const clearDataButton = document.getElementById("clear-data-button");

let editingProductId = null;

const salesForm = document.getElementById("sales-form");
const salesList = document.getElementById("sales-list");
const saleProduct = document.getElementById("sale-product");
const saleQuantity = document.getElementById("sale-quantity");
const saleTotal = document.getElementById("sale-total");

const expenseForm = document.getElementById("expense-form");
const expensesList = document.getElementById("expenses-list");


function saveData() {
    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem("sales", JSON.stringify(sales));
    localStorage.setItem("expenses", JSON.stringify(expenses));
    localStorage.setItem("dashboardTotals", JSON.stringify(dashboardTotals));
}


// =========================
// PRODUCTS
// =========================

productForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = document.getElementById("product-name").value.trim();
    const buyingPrice = Number(document.getElementById("buying-price").value);
    const sellingPrice = Number(document.getElementById("selling-price").value);
    const quantity = Number(document.getElementById("product-quantity").value);

    if (
        name === "" ||
        !Number.isFinite(buyingPrice) ||
        !Number.isFinite(sellingPrice) ||
        !Number.isFinite(quantity) ||
        buyingPrice < 0 ||
        sellingPrice < 0 ||
        quantity < 1
    ) {
        alert("Please enter all product information.");
        return;
    }

    if (editingProductId !== null) {

        const product = products.find(function (item) {
            return item.id === editingProductId;
        });

        if (product) {
            product.name = name;
            product.buyingPrice = buyingPrice;
            product.sellingPrice = sellingPrice;
            product.quantity = quantity;
        }

        editingProductId = null;
        productSubmitButton.textContent = "Add Product";

    } else {

        products.push({
            id: Date.now(),
            name: name,
            buyingPrice: buyingPrice,
            sellingPrice: sellingPrice,
            quantity: quantity
        });

        dashboardTotals.totalProducts++;
    }

    saveData();
    showProducts();
    updateDashboard();

    productForm.reset();
});


function showProducts() {

    productsList.innerHTML = "";

    saleProduct.innerHTML = '<option value="">Select Product</option>';

    products.forEach(function (product) {
        const item = document.createElement("div");

        if (product.quantity <= 5) {
            item.classList.add("low-stock");
        }

        let stockMessage = "";

        if (product.quantity <= 5) {
            stockMessage =
                '<span class="low-stock-text">⚠ Low Stock</span>';
        }

        item.innerHTML =
            '<div class="list-item-header"><strong>' + product.name + '</strong>' +
            (product.quantity <= 5 ? stockMessage : '') + '</div>' +
            '<div class="list-item-details">' +
            '<span>Buying: ' + product.buyingPrice.toLocaleString() + ' RWF</span>' +
            '<span>Selling: ' + product.sellingPrice.toLocaleString() + ' RWF</span>' +
            '<span>Stock: ' + product.quantity + '</span>' +
            '</div>' +
            '<div class="list-item-actions">' +
            '<button onclick="editProduct(' + product.id + ')">Edit</button>' +
            '<button class="delete-button" onclick="deleteProduct(' + product.id + ')">Delete</button>' +
            '</div>';

        productsList.appendChild(item);
    });


    // Products available for sales

    products.forEach(function (product) {

        if (product.quantity > 0) {

            const option = document.createElement("option");

            option.value = product.id;

            option.textContent =
                product.name + " (Stock: " + product.quantity + ")";

            saleProduct.appendChild(option);
        }
    });
}


// =========================
// EDIT PRODUCT
// =========================

function editProduct(id) {

    const product = products.find(function (item) {
        return item.id === id;
    });

    if (!product) {
        return;
    }

    document.getElementById("product-name").value = product.name;
    document.getElementById("buying-price").value = product.buyingPrice;
    document.getElementById("selling-price").value = product.sellingPrice;
    document.getElementById("product-quantity").value = product.quantity;

    editingProductId = product.id;

    productSubmitButton.textContent = "Update Product";

    document.getElementById("product-name").focus();
}


// =========================
// DELETE PRODUCT
// =========================

function deleteProduct(id) {

    const product = products.find(function (item) {
        return item.id === id;
    });

    if (!product) {
        return;
    }

    const confirmDelete =
        confirm("Delete " + product.name + "?");

    if (!confirmDelete) {
        return;
    }

    products = products.filter(function (item) {
        return item.id !== id;
    });

    saveData();
    showProducts();
    updateDashboard();
}


// =========================
// SALES
// =========================

saleProduct.addEventListener("change", updateSaleTotal);
saleQuantity.addEventListener("input", updateSaleTotal);


function updateSaleTotal() {

    const product = products.find(function (item) {
        return item.id == saleProduct.value;
    });

    const quantity = Number(saleQuantity.value);

    if (product && quantity > 0) {

        saleTotal.textContent =
            (product.sellingPrice * quantity).toLocaleString() + " RWF";

    } else {

        saleTotal.textContent = "0 RWF";
    }
}


salesForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const customer =
        document.getElementById("sale-customer").value.trim();

    const product = products.find(function (item) {
        return item.id == saleProduct.value;
    });

    const quantity = Number(saleQuantity.value);


    if (
        customer === "" ||
        !product ||
        !Number.isFinite(quantity) ||
        quantity < 1 ||
        !Number.isInteger(quantity)
    ) {

        alert("Please enter all sale information.");
        return;
    }


    if (quantity > product.quantity) {

        alert("Not enough stock.");
        return;
    }


    const total =
        product.sellingPrice * quantity;


    const buyingCost =
        product.buyingPrice * quantity;


    sales.push({

        id: Date.now(),

        customer: customer,

        productId: product.id,

        product: product.name,

        quantity: quantity,

        total: total,

        buyingCost: buyingCost,

        date: new Date().toLocaleDateString()
    });

    dashboardTotals.totalSales += total;
    dashboardTotals.totalBuyingCost += buyingCost;
    dashboardTotals.salesCount++;


    product.quantity -= quantity;


    saveData();

    showProducts();
    showSales();
    updateDashboard();


    salesForm.reset();

    saleTotal.textContent = "0 RWF";
});


function showSales() {

    salesList.innerHTML = "";


    sales.forEach(function (sale) {

        const item = document.createElement("div");


        item.innerHTML =
            '<div class="list-item-header"><strong>' + sale.product + '</strong></div>' +
            '<div class="list-item-details">' +
            '<span>Customer: ' + sale.customer + '</span>' +
            '<span>Quantity: ' + sale.quantity + '</span>' +
            '<span>Total: ' + sale.total.toLocaleString() + ' RWF</span>' +
            '<span>Date: ' + sale.date + '</span>' +
            '</div>' +
            '<div class="list-item-actions">' +
            '<button class="delete-button" onclick="deleteSale(' + sale.id + ')">Delete</button>' +
            '</div>';


        salesList.appendChild(item);
    });
}


// =========================
// DELETE SALE
// =========================

function deleteSale(id) {

    const sale = sales.find(function (item) {
        return item.id === id;
    });

    if (!sale) {
        return;
    }

    const confirmDelete =
        confirm("Delete this sale?");

    if (!confirmDelete) {
        return;
    }

    const product = products.find(function (item) {
        return item.id === sale.productId ||
            (sale.productId === undefined && item.name === sale.product);
    });

    if (product) {
        product.quantity += sale.quantity;
    }

    sales = sales.filter(function (item) {
        return item.id !== id;
    });

    saveData();

    showProducts();
    showSales();
    updateDashboard();
}


// =========================
// EXPENSES
// =========================

expenseForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const name =
        document.getElementById("expense-name").value.trim();

    const category =
        document.getElementById("expense-category").value;

    const amount =
        Number(document.getElementById("expense-amount").value);

    const date =
        document.getElementById("expense-date").value;


    if (
        name === "" ||
        category === "" ||
        !Number.isFinite(amount) ||
        amount < 0 ||
        date === ""
    ) {

        alert("Please enter all expense information.");
        return;
    }


    expenses.push({

        id: Date.now(),

        name: name,

        category: category,

        amount: amount,

        date: date
    });

    dashboardTotals.totalExpenses += amount;


    saveData();

    showExpenses();
    updateDashboard();

    expenseForm.reset();
});


function showExpenses() {

    expensesList.innerHTML = "";


    expenses.forEach(function (expense) {

        const item = document.createElement("div");


        item.innerHTML =
            '<div class="list-item-header"><strong>' + expense.name + '</strong></div>' +
            '<div class="list-item-details">' +
            '<span>Category: ' + expense.category + '</span>' +
            '<span>Amount: ' + expense.amount.toLocaleString() + ' RWF</span>' +
            '<span>Date: ' + expense.date + '</span>' +
            '</div>' +
            '<div class="list-item-actions">' +
            '<button class="delete-button" onclick="deleteExpense(' + expense.id + ')">Delete</button>' +
            '</div>';


        expensesList.appendChild(item);
    });
}


// =========================
// DELETE EXPENSE
// =========================

function deleteExpense(id) {

    const confirmDelete =
        confirm("Delete this expense?");

    if (!confirmDelete) {
        return;
    }

    expenses = expenses.filter(function (item) {
        return item.id !== id;
    });

    saveData();

    showExpenses();
}


// =========================
// DASHBOARD
// =========================

function updateDashboard() {
    const currentLowStock = products.filter(function (product) {
        return product.quantity <= 5;
    }).length;

    const totalProfit =
        dashboardTotals.totalSales -
        dashboardTotals.totalBuyingCost -
        dashboardTotals.totalExpenses;


    document.getElementById("total-sales").textContent =
        dashboardTotals.totalSales.toLocaleString() + " RWF";


    document.getElementById("total-expenses").textContent =
        dashboardTotals.totalExpenses.toLocaleString() + " RWF";


    document.getElementById("total-profit").textContent =
        totalProfit.toLocaleString() + " RWF";


    document.getElementById("total-products").textContent =
        dashboardTotals.totalProducts;


    document.getElementById("sales-count").textContent =
        dashboardTotals.salesCount;


    document.getElementById("low-stock-count").textContent =
        currentLowStock;
}


clearDataButton.addEventListener("click", function () {
    if (!confirm("Clear all products, sales, expenses, and totals?")) {
        return;
    }

    products = [];
    sales = [];
    expenses = [];
    dashboardTotals = {
        totalSales: 0,
        totalExpenses: 0,
        totalBuyingCost: 0,
        totalProducts: 0,
        salesCount: 0,
        lowStock: 0
    };

    saveData();
    showProducts();
    showSales();
    showExpenses();
    updateDashboard();
});


// =========================
// START
// =========================

showProducts();
showSales();
showExpenses();
updateDashboard();
