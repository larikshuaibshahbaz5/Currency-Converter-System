const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";
const dropdowns = document.querySelectorAll(".dropdown select");
const bnt = document.querySelector("form button");
const amountInput = document.querySelector(".amount input");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const swapIcon = document.querySelector(".dropdown i");

const upDataExchangeRate = async () => {
    const amountValue = Number(amountInput.value.trim());

    if (!Number.isFinite(amountValue) || amountValue <= 0) {
        msg.innerText = "Please enter a valid amount.";
        return;
    }

    const from = fromCurr.value.toLowerCase();
    const to = toCurr.value.toLowerCase();

    if (from === to) {
        msg.innerText = `${amountValue} ${fromCurr.value} = ${amountValue} ${toCurr.value}`;
        return;
    }

    const url = `${BASE_URL}/${from}.json`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Exchange-rate request failed: ${response.status}`);
    }

    const data = await response.json();
    const rate = data[from][to];
    const finalValue = amountValue * rate;

    msg.innerText = `${amountValue} ${fromCurr.value} = ${finalValue.toFixed(2)} ${toCurr.value}`;
};

for (const select of dropdowns) {
    for (const currCode in countryList) {
        const newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;

        if (select.name === "from" && currCode === "USD") {
            newOption.selected = true;
        } else if (select.name === "to" && currCode === "PKR") {
            newOption.selected = true;
        }

        select.append(newOption);
    }

    select.addEventListener("change", (event) => {
        upDateFlag(event.target);
    });
}

const upDateFlag = (element) => {
    const currCode = element.value;
    const countryCode = countryList[currCode];
    const newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    const img = element.parentElement.querySelector("img");

    if (img) {
        img.src = newSrc;
    }
};

bnt.addEventListener("click", (event) => {
    event.preventDefault();
    upDataExchangeRate();
});

swapIcon.addEventListener("click", () => {
    const previousFrom = fromCurr.value;
    fromCurr.value = toCurr.value;
    toCurr.value = previousFrom;

    upDateFlag(fromCurr);
    upDateFlag(toCurr);
});

window.addEventListener("load", () => {
    upDateFlag(fromCurr);
    upDateFlag(toCurr);
});