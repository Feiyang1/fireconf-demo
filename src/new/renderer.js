import { signInAnonymously, signOut } from './auth';

const headerEl = document.getElementById("header");
const contentHomeEl = document.getElementById("home");


export function renderUserPage(user) {
    headerEl.innerHTML = "";
    contentHomeEl.innerHTML = "";
    renderHeader('Personal page', user);
    renderTableHeading('Watchlist', user);
    renderTable()
}

export function renderLoginPage(pageState) {
    headerEl.innerHTML = "";
    contentHomeEl.innerHTML = "";
    renderHeader(pageState.title, null);
    renderTableHeading('Popular stocks');
    renderTable(pageState.tableData);
}

const HEADER_LABELS = [
    "symbol",
    "current",
    "change",
    "",
    "updated at",
    "with data from"
];

export function renderTableHeading(title, user) {
    const containerEl = document.createElement("div");
    containerEl.className = 'table-heading';
    const titleEl = document.createElement("h1");
    titleEl.className = "container-title";
    titleEl.innerText = title;
    containerEl.append(titleEl);

    /**
     * render the button to add stocks to the watchlist if we are rendering for a logged in user
     */
    if (user) {
        const addToWatchListButtonContainer = document.createElement('div');
        renderAddTickerButton(addToWatchListButtonContainer);
        containerEl.append(addToWatchListButtonContainer);
    }

    contentHomeEl.append(containerEl);
}

function renderAddTickerButton(container) {
    
    container.innerHTML = `
        <div class="dropdown">
            <div class="dropdown-trigger">
                <div class="button" aria-haspopup="true" aria-controls="dropdown-menu">
                    <span>+ Add</span>
                </div>
            </div>
            <div class="dropdown-menu" id="dropdown-menu" role="menu">
                <div class="dropdown-content">
                    <a href="#" class="dropdown-item">
                    Dropdown item
                    </a>
                    <a class="dropdown-item">
                    Other dropdown item
                    </a>
                    <a href="#" class="dropdown-item is-active">
                    Active dropdown item
                    </a>
                    <a href="#" class="dropdown-item">
                    Other dropdown item
                    </a>
                    <hr class="dropdown-divider">
                    <a href="#" class="dropdown-item">
                    With a divider
                    </a>
                </div>
            </div>
        </div>
    `;

    const dropdownContainer = container.getElementsByClassName('dropdown')[0];
    const trigger = container.getElementsByClassName('dropdown-trigger')[0];
    trigger.addEventListener('click', () => {
        console.log('clicked!');
        if(dropdownContainer.classList.contains('is-active')) {
            dropdownContainer.classList.remove('is-active');
        } else {
            dropdownContainer.classList.add('is-active');
        }
    })
}

export function renderTable(tableData) {
    const containerEl = document.createElement("div");

    if (tableData && tableData.length) {
        const tableEl = document.createElement("div");
        tableEl.className = "table";
        const headerRow = document.createElement("div");
        headerRow.className = "row";
        HEADER_LABELS.forEach(label => {
            const headerCell = document.createElement("div");
            headerCell.className = "header-cell";
            headerCell.innerText = label;
            headerRow.append(headerCell);
        });
        tableEl.append(headerRow);
        tableData.forEach(rowData => renderRow(tableEl, rowData));
        containerEl.append(tableEl);
    }
    contentHomeEl.append(containerEl);
}

export function renderRow(tableEl, rowData) {
    const { symbol, value, delta, timestamp } = rowData;
    const changeClasses = ["cell"];
    if (delta > 0) {
        changeClasses.push("positive");
    } else if (delta < 0) {
        changeClasses.push("negative");
    }
    const rowEl = document.createElement("div");
    rowEl.className = "row";

    const symbolCell = document.createElement("div");
    symbolCell.className = "cell symbol-cell";
    const symbolBlock = document.createElement("div");
    symbolBlock.className = "symbol-block";
    symbolBlock.innerText = symbol;
    symbolCell.append(symbolBlock);
    rowEl.append(symbolCell);

    const priceCell = document.createElement("div");
    priceCell.className = "cell price-cell";
    priceCell.innerText = value ? value.toFixed(2) : "-";
    rowEl.append(priceCell);

    const changeCell = document.createElement("div");
    changeCell.className = changeClasses.join(" ");
    changeCell.innerText = delta ? delta.toFixed(2) : "-";
    rowEl.append(changeCell);

    const arrowCell = document.createElement("div");
    arrowCell.className = "cell";
    const arrow = document.createElement("div");
    arrow.className = delta > 0 ? "arrow-up" : "arrow-down";
    arrowCell.append(arrow);
    rowEl.append(arrowCell);

    const dateUpdatedCell = document.createElement("div");
    dateUpdatedCell.className = "cell date-cell";
    dateUpdatedCell.innerText = new Date().toLocaleString();
    rowEl.append(dateUpdatedCell);

    const dateFromCell = document.createElement("div");
    dateFromCell.className = "cell date-cell";
    dateFromCell.innerText = new Date(timestamp).toLocaleString();
    rowEl.append(dateFromCell);

    tableEl.append(rowEl);
}

/**
 * 
 * @param {*} title
 * @param {*} user - user logged in. null if no user is logged in
 */
export function renderHeader(title, user) {
    const titleEl = document.createElement("h1");
    titleEl.className = "title";
    titleEl.innerText = title;
    headerEl.append(titleEl);
    const navEl = document.createElement('nav');

    const loginOrLogoutButton = document.createElement('button');

    if (!user) { // render login button
        loginOrLogoutButton.textContent = 'login';
        loginOrLogoutButton.className = 'login-button';

        loginOrLogoutButton.addEventListener('click', () => {
            signInAnonymously();
        });
    } else { // render logout button
        loginOrLogoutButton.textContent = 'logout';
        loginOrLogoutButton.className = 'login-button';

        loginOrLogoutButton.addEventListener('click', () => {
            signOut();
        });
    }

    navEl.append(loginOrLogoutButton);
    headerEl.append(navEl);
}

export function logPerformance() {
    if (!performance) return;
    performance.getEntries().forEach(entry => {
        let label = entry.name;
        let time = entry.duration
        let navStart = 0;
        if (entry.entryType === 'navigation') {
            label = 'loadEventEnd';
            navStart = entry.startTime;
        } else if (entry.entryType === 'resource') {
            if (entry.name.includes('googleapis')) {
                label = 'Firestore channel';
            } else {
                const parts = entry.name.split('/');
                label = 'resource: ' + parts[parts.length - 1];
            }
        } else if (entry.entryType === 'paint') {
            time = entry.startTime - navStart;
        }
        console.log(label, Math.round(time));
    });
}

