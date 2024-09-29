const $overlay = document.querySelector("#overlay") as HTMLDivElement;
const $modal = document.querySelector("#modal") as HTMLDivElement;
const $incomeBtn = document.querySelector("#incomeBtn") as HTMLButtonElement;
const $expenseBtn = document.querySelector("#expenseBtn") as HTMLButtonElement;
const $closeBtn = document.querySelector("#closeBtn") as HTMLButtonElement;
const $transactionForm = document.querySelector("#transactionForm") as HTMLFormElement;
const $alertError = document.querySelector("#alertError") as HTMLDivElement;
const $transactionList = document.querySelector("#transactionList") as HTMLDivElement;

const url = new URL(location.href);
let ALL_TRANSACTIONS: Transaction[] = JSON.parse(localStorage.getItem("transactions") as string) || [];


class Transaction {
    transactionName: string;
    transactionType: string | undefined;
    transactionAmount: number;
    type: string;
    date: number;

    constructor(transactionName: string, transactionAmount: number, transactionType: string | undefined, type: string) {
        this.transactionName = transactionName;
        this.transactionType = transactionType;
        this.transactionAmount = transactionAmount;
        this.type = type;
        this.date = Date.now();
    }
}

const renderTransactions = () => {
    $transactionList.innerHTML = '';
    ALL_TRANSACTIONS.forEach((transaction: Transaction) => {
        const li = document.createElement('li');
        li.className = "list-group-item flex items-center justify-between mb-4";
        li.innerHTML = `
    <div class="flex items-center justify-between p-6 shadow-lg w-full rounded-lg h-auto bg-gradient-to-r from-blue-400 to-purple-500">
    <div class="flex flex-col">
            <div class="text-2xl text-white font-bold">${transaction.transactionType || 'Turi belgilanmagan'}</div>
            <div class="text-lg text-gray-200 mt-1">${transaction.transactionName}</div>
    </div>
    <div class="text-right">
         <div class="font-bold text-2xl text-yellow-300">${transaction.transactionAmount} UZS</div>
        <div class="text-sm text-gray-100">${new Date(transaction.date).toLocaleTimeString()}</div>
            <div class="flex space-x-4 mt-2">
                <button class="bg-white text-blue-600 hover:bg-blue-500 hover:text-white font-semibold border border-blue-600 px-4 py-2 rounded transition duration-300">Edit</button>
                <button class="bg-white text-red-600 hover:bg-red-500 hover:text-white font-semibold border border-red-600 px-4 py-2 rounded transition duration-300">Delete</button>
            </div>
        </div>
     </div>

        `;
        $transactionList.appendChild(li);
    });
};


const getCurrentQuery = () => {
    return new URLSearchParams(location.search).get('modal') || "" as string;
};


const checkModalOpen = () => {
    const openModal = getCurrentQuery();
    const $select = $transactionForm.querySelector("select") as HTMLSelectElement;

    if (openModal === "income" || openModal === "expense") {
        $overlay.classList.remove("hidden");
        if (openModal === "expense") {
            $select.classList.remove("hidden");
        } else {
            $select.classList.add("hidden");
        }
    } else {
        $overlay.classList.add("hidden");
    }
};


const showToast = (message: string) => {
    $alertError.innerText = message;
    $alertError.classList.remove("hidden");
    setTimeout(() => {
        $alertError.classList.add("hidden");
    }, 3000);
};


const createNewTransaction = (e: Event) => {
    e.preventDefault();

    const inputs = Array.from($transactionForm.querySelectorAll("input, select")) as HTMLInputElement[];
    const values: (string | number | undefined)[] = inputs.map((input) => {
        return input.type === "number" ? +input.value : input.value || undefined;
    });

    if (values.every(value => (typeof value === "string" ? value.trim().length > 0 : value > 0))) {
        const newTransaction = new Transaction(...(values as [string, number, string | undefined]), getCurrentQuery());
        ALL_TRANSACTIONS.push(newTransaction);
        localStorage.setItem("transactions", JSON.stringify(ALL_TRANSACTIONS));
        renderTransactions();
        window.history.pushState({ path: location.href.split("?")[0] }, "", location.href.split("?")[0]);
        checkModalOpen();
    } else {
        showToast("Please fill all fields correctly.");
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



