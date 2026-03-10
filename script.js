let items = [];
let invoiceNumber = 1;
let totalSales = 0;

function addItem(){
    let name = document.getElementById("item").value;
    let price = parseFloat(document.getElementById("price").value);
    let qty = parseInt(document.getElementById("qty").value);
    if(!name || !price || !qty) return;

    items.push({name, price, qty});

    document.getElementById("item").value = "";
    document.getElementById("price").value = "";
    document.getElementById("qty").value = "";

    updateDeleteDropdown();
    document.getElementById("item").focus();
}

function generateInvoice(){
    let customer = document.getElementById("customer").value;
    let date = new Date().toLocaleString();

    let output =
`=====================================
        AUTOMATED INVOICE SYSTEM
=====================================

Invoice No: ${invoiceNumber}
Date: ${date}
Customer: ${customer}
-------------------------------------
Item        Price     Qty      Total
-------------------------------------
`;

    let subtotal = 0;
    items.forEach(item => {
        let total = item.price * item.qty;
        subtotal += total;
        output += item.name.padEnd(12) + ("₱"+item.price.toFixed(2)).padEnd(10) + item.qty.toString().padEnd(8) + ("₱"+total.toFixed(2)) + "\n";
    });

    let tax = subtotal * 0.12;
    let grand = subtotal + tax;

    output += "-------------------------------------\n";
    output += `Subtotal: ₱${subtotal.toFixed(2)}\n`;
    output += `Tax (12%): ₱${tax.toFixed(2)}\n`;
    output += `Grand Total: ₱${grand.toFixed(2)}\n`;
    output += "=====================================";

    document.getElementById("invoiceBox").textContent = output;
}

function saveInvoice(){
    let text = document.getElementById("invoiceBox").textContent;
    if(!text) return;

    let history = document.getElementById("historyList");
    let div = document.createElement("div");
    div.textContent = "Invoice " + invoiceNumber;
    history.appendChild(div);

    let subtotal = 0;
    items.forEach(item => { subtotal += item.price * item.qty; });
    let tax = subtotal * 0.12;
    let grand = subtotal + tax;

    totalSales += grand;
    document.getElementById("totalSales").textContent = totalSales.toFixed(2);

    invoiceNumber++;
    items = [];
    updateDeleteDropdown();
}

function updateDeleteDropdown(){
    let select = document.getElementById("deleteItemSelect");
    select.innerHTML = '<option value="">-- Select Item --</option>';
    items.forEach((item, index) => {
        select.innerHTML += `<option value="${index}">${item.name} - Qty: ${item.qty}</option>`;
    });
}

function addQty(){
    let select = document.getElementById("deleteItemSelect");
    let index = select.value;
    let change = parseInt(document.getElementById("changeQty").value);
    if(index === "" || !change) return;
    items[index].qty += change;
    document.getElementById("changeQty").value = "";
    updateDeleteDropdown();
    generateInvoice();
}

function subtractQty(){
    let select = document.getElementById("deleteItemSelect");
    let index = select.value;
    let change = parseInt(document.getElementById("changeQty").value);
    if(index === "" || !change) return;
    items[index].qty -= change;
    if(items[index].qty <= 0){ items.splice(index,1); }
    document.getElementById("changeQty").value = "";
    updateDeleteDropdown();
    generateInvoice();
}

function deleteSelectedItem(){
    let select = document.getElementById("deleteItemSelect");
    let index = select.value;
    if(index === "") return;
    items.splice(index,1);
    updateDeleteDropdown();
    generateInvoice();
}

function resetInvoice(){
    items = [];
    document.getElementById("customer").value = "";
    document.getElementById("item").value = "";
    document.getElementById("price").value = "";
    document.getElementById("qty").value = "";
    document.getElementById("invoiceBox").textContent = "";
    document.getElementById("deleteItemSelect").innerHTML = '<option value="">-- Select Item --</option>';
}

function printInvoice(){
    let content = document.getElementById("invoiceBox").textContent;
    let win = window.open("", "", "width=600,height=600");
    win.document.write("<pre>" + content + "</pre>");
    win.print();
}

// ENTER KEY NAVIGATION
document.getElementById("customer").addEventListener("keypress", e => { if(e.key==="Enter") document.getElementById("item").focus(); });
document.getElementById("item").addEventListener("keypress", e => { if(e.key==="Enter") document.getElementById("price").focus(); });
document.getElementById("price").addEventListener("keypress", e => { if(e.key==="Enter") document.getElementById("qty").focus(); });
document.getElementById("qty").addEventListener("keypress", e => { if(e.key==="Enter") addItem(); });