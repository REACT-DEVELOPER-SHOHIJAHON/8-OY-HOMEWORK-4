"use strict";
const $overlay = document.querySelector("#overlay");
const $modal = document.querySelector("#modal");
const $incomeBtn = document.querySelector("#incomeBtn");
const $expenseBtn = document.querySelector("#expenseBtn");
const $closeBtn = document.querySelector("#closeBtn");
const $transactionForm = document.querySelector("#transactionForm");
const $alertError = document.querySelector("#alertError");
const $transactionList = document.querySelector("#transactionList");
const url = new URL(location.href);
let ALL_TRANSACTIONS = JSON.parse(localStorage.getItem("transactions")) || [];
const renderTransactions = () => {
    $transactionList.innerHTML = '';
    ALL_TRANSACTIONS.forEach((transaction) => {
        const li = document.createElement('li');
        li.className = "list-group-item flex items-center justify-between mb-4";
        li.innerHTML = `
           <div class="flex items-center justify-between p-6 align-middle shadow-md w-full rounded-lg h-auto bg-white"> <!-- фоновый цвет для блока -->
            <div class="flex flex-col">
                <div class="text-xl text-gray-700 font-bold">${transaction.transactionType || 'Тип не указан'}</div>
                <div class="text-lg text-gray-500 ml-2">${transaction.transactionName}</div>
            </div>
            <div class="text-right">
                <div class="font-bold text-lg text-green-600">${transaction.transactionAmount} UZS</div> <!-- цвет для суммы -->
                <div class="text-sm text-gray-400">${new Date(transaction.date).toLocaleTimeString()}</div>
                <div class="flex space-x-4 mt-2">
                    <button class="text-blue-500 hover:text-blue-700 font-semibold border border-blue-500 px-2 py-1 rounded">Edit</button>
                    <button class="text-red-500 hover:text-red-700 font-semibold border border-red-500 px-2 py-1 rounded">delete</button>
                </div>
            </div>
           </div>
        `;
        $transactionList.appendChild(li);
    });
};
const getCurrentQuery = () => {
    return new URLSearchParams(location.search).get('modal') || "";
};
const checkModalOpen = () => {
    let openModal = getCurrentQuery();
    let $select = $transactionForm.querySelector("select");
    if (openModal === "income") {
        $overlay.classList.remove("hidden");
        $select.classList.add("hidden");
    }
    else if (openModal === "expense") {
        $overlay.classList.remove("hidden");
        $select.classList.remove("hidden");
    }
    else {
        $overlay.classList.add("hidden");
    }
};
class Transaction {
    transactionName;
    transactionType;
    transactionAmount;
    type;
    date;
    constructor(transactionName, transactionAmount, transactionType, type) {
        this.transactionName = transactionName;
        this.transactionType = transactionType;
        this.transactionAmount = transactionAmount;
        this.type = type;
        this.date = new Date().getTime();
    }
}
const createNewTransaction = (e) => {
    e.preventDefault();
    let timeOut;
    function showToast() {
        $alertError.classList.remove("hidden");
        timeOut = setTimeout(() => {
            $alertError.classList.add("hidden");
        }, 3000);
    }
    const inputs = Array.from($transactionForm.querySelectorAll("input, select"));
    const values = inputs.map((input) => {
        if (input.type === "number") {
            return +input.value;
        }
        return input.value ? input.value : undefined;
    });
    if (values.every((value) => (typeof value === "string" ? value?.trim().length > 0 : value && value > 0))) {
        const newTransaction = new Transaction(...values, getCurrentQuery());
        ALL_TRANSACTIONS.push(newTransaction);
        localStorage.setItem("transactions", JSON.stringify(ALL_TRANSACTIONS));
        renderTransactions();
        window.history.pushState({ path: location.href.split("?")[0] }, "", location.href.split("?")[0]);
        checkModalOpen();
    }
    else {
        clearTimeout(timeOut);
        showToast();
    }
};
$incomeBtn.addEventListener("click", () => {
    url.searchParams.set("modal", "income");
    window.history.pushState({ path: location.href.split("?")[0] + "?" + url.searchParams }, "", location.href.split("?")[0] + "?" + url.searchParams);
    checkModalOpen();
});
$expenseBtn.addEventListener("click", () => {
    url.searchParams.set("modal", "expense");
    window.history.pushState({ path: location.href.split("?")[0] + "?" + url.searchParams }, "", location.href.split("?")[0] + "?" + url.searchParams);
    checkModalOpen();
});
$closeBtn.addEventListener("click", () => {
    window.history.pushState({ path: location.href.split("?")[0] }, "", location.href.split("?")[0]);
    checkModalOpen();
});
$transactionForm.addEventListener("submit", createNewTransaction);
window.onload = () => {
    checkModalOpen();
    renderTransactions();
};
