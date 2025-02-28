document.addEventListener("DOMContentLoaded", function () {
    let memoryValue = 0;

    // بررسی لود شدن nerdamer
    if (typeof nerdamer === "undefined") {
        console.warn("⚠️ Warning: nerdamer library is not loaded. Equation solving may not work.");
    }

    // تغییر حالت تاریک/روشن
    document.getElementById("toggle-theme").addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");
        this.innerText = document.body.classList.contains("dark-mode") ? "☀️ Light Mode" : "🌙 Dark Mode";
    });

    // نمایش یا مخفی کردن تاریخچه
    document.getElementById("toggle-history").addEventListener("click", function () {
        document.getElementById("history-panel").classList.toggle("hidden");
    });

    // لود تاریخچه از localStorage
    loadHistory();

    // افزودن مقدار به نمایشگر
    window.appendToDisplay = function (value) {
        let display = document.getElementById("display");
        let lastChar = display.value.slice(-1);
        let operators = ["+", "-", "*", "/", "%"];

        // جلوگیری از عملگر در ابتدا (به جز منفی)
        if (display.value === "" && operators.includes(value) && value !== "-") return;
        // جلوگیری از دو عملگر پشت سر هم
        if (operators.includes(lastChar) && operators.includes(value)) return;

        display.value += value;
    };

    // پاک کردن نمایشگر
    window.clearDisplay = function () {
        document.getElementById("display").value = "";
    };

    // حذف آخرین کاراکتر
    window.deleteLast = function () {
        let display = document.getElementById("display");
        display.value = display.value.slice(0, -1);
    };

    // حذف کل تاریخچه
    window.clearHistory = function () {
        document.getElementById("history-list").innerHTML = "";
        localStorage.removeItem("calcHistory");
    };

    // به‌روزرسانی تاریخچه
    function updateHistory(result) {
        let historyList = document.getElementById("history-list");
        let listItem = document.createElement("li");
        listItem.textContent = result;

        let deleteBtn = document.createElement("button");
        deleteBtn.innerText = "❌";
        deleteBtn.style.marginLeft = "10px";
        deleteBtn.onclick = function () {
            listItem.remove();
            saveHistory();
        };

        listItem.appendChild(deleteBtn);
        historyList.prepend(listItem);
        saveHistory();
    }

    // ذخیره تاریخچه در localStorage
    function saveHistory() {
        let historyList = document.getElementById("history-list").innerHTML;
        localStorage.setItem("calcHistory", historyList);
    }

    // لود تاریخچه از localStorage
    function loadHistory() {
        let savedHistory = localStorage.getItem("calcHistory");
        if (savedHistory) {
            document.getElementById("history-list").innerHTML = savedHistory;
            // بازگرداندن رویداد حذف به دکمه‌ها
            document.querySelectorAll("#history-list button").forEach(btn => {
                btn.onclick = function () {
                    btn.parentElement.remove();
                    saveHistory();
                };
            });
        }
    }

    // انجام محاسبات
    window.calculateResult = function () {
        let display = document.getElementById("display");
        let expression = display.value.trim();

        if (expression.includes("=")) {
            display.value = "Use the green button for equations!";
            return;
        }

        try {
            let result = math.evaluate(expression);
            display.value = result;
            updateHistory(`${expression} = ${result}`);
        } catch (error) {
            display.value = "Error!";
        }
    };

    // کپی نتیجه به کلیپ‌بورد
    window.copyResult = function () {
        let display = document.getElementById("display");
        navigator.clipboard.writeText(display.value).then(() => {
            alert("Result copied to clipboard!");
        });
    };

    // حل معادلات
    window.solveEquation = function () {
        let display = document.getElementById("display");
        let equation = display.value.trim().replace(/×/g, "*");

        if (!equation.includes("x")) {
            display.value = "Enter an equation with x!";
            return;
        }

        if (typeof nerdamer !== "undefined") {
            try {
                let solutions = nerdamer(equation).solveFor("x");
                display.value = `x = ${solutions.toString()}`;
                updateHistory(`${equation} ⟶ x = ${solutions.toString()}`);
            } catch (error) {
                display.value = "Error solving equation!";
            }
        } else {
            display.value = "Equation solver library not loaded!";
        }
    };

    // محاسبه جذر
    window.calculateSquareRoot = function () {
        let display = document.getElementById("display");
        let value = parseFloat(display.value);

        if (value >= 0) {
            display.value = Math.sqrt(value);
            updateHistory(`√${value} = ${display.value}`);
        } else {
            display.value = "Negative number not allowed!";
        }
    };

    // محاسبه توان
    window.calculatePower = function () {
        let display = document.getElementById("display");
        let base = parseFloat(display.value);
        let exponent = parseFloat(prompt("Enter the exponent:"));

        if (!isNaN(base) && !isNaN(exponent)) {
            display.value = Math.pow(base, exponent);
            updateHistory(`${base}^${exponent} = ${display.value}`);
        } else {
            alert("Invalid input!");
        }
    };

    // محاسبه فاکتوریل
    window.calculateFactorial = function () {
        let display = document.getElementById("display");
        let value = parseInt(display.value);

        if (value < 0) {
            display.value = "Negative number not allowed!";
            return;
        }

        let factorial = 1;
        for (let i = 1; i <= value; i++) {
            factorial *= i;
        }

        display.value = factorial;
        updateHistory(`${value}! = ${display.value}`);
    };

    // توابع مثلثاتی
    function calculateTrigFunction(func) {
        let display = document.getElementById("display");
        let value = parseFloat(display.value);

        if (!isNaN(value)) {
            let result = Math[func](value * Math.PI / 180);
            display.value = result;
            updateHistory(`${func}(${value}) = ${result}`);
        }
    }

    window.calculateSin = function () { calculateTrigFunction("sin"); };
    window.calculateCos = function () { calculateTrigFunction("cos"); };
    window.calculateTan = function () { calculateTrigFunction("tan"); };

    // توابع لگاریتمی و نمایی
    window.calculateLn = function () {
        let display = document.getElementById("display");
        let value = parseFloat(display.value);

        if (value > 0) {
            display.value = Math.log(value);
            updateHistory(`ln(${value}) = ${display.value}`);
        } else {
            display.value = "Negative number not allowed!";
        }
    };

    window.calculateExp = function () {
        let display = document.getElementById("display");
        display.value = Math.exp(parseFloat(display.value));
        updateHistory(`exp(${display.value})`);
    };

    // مدیریت حافظه
    window.memoryClear = function () { memoryValue = 0; };
    window.memoryRecall = function () { appendToDisplay(memoryValue); };
    window.memoryAdd = function () { memoryValue += parseFloat(document.getElementById("display").value) || 0; };
    window.memorySubtract = function () { memoryValue -= parseFloat(document.getElementById("display").value) || 0; };

    // پشتیبانی از صفحه‌کلید
    document.addEventListener("keydown", function (event) {
        const keyMap = { '+': '+', '-': '-', '*': '*', '/': '/', '%': '%', '.': '.' };
        if (keyMap[event.key]) appendToDisplay(keyMap[event.key]);
        else if (event.key === 'Enter') calculateResult();
        else if (event.key === 'Backspace') deleteLast();
        else if (event.key === 'Escape') clearDisplay();
    });
});
// ... (بقیه کدهای قبلی بدون تغییر)

// محاسبه لگاریتم پایه 10
window.calculateLog10 = function () {
    let display = document.getElementById("display");
    let value = parseFloat(display.value);

    if (value > 0) {
        display.value = Math.log10(value);
        updateHistory(`log₁₀(${value}) = ${display.value}`);
    } else {
        display.value = "Negative number not allowed!";
    }
};

// محاسبه لگاریتم پایه 2
window.calculateLog2 = function () {
    let display = document.getElementById("display");
    let value = parseFloat(display.value);

    if (value > 0) {
        display.value = Math.log2(value);
        updateHistory(`log₂(${value}) = ${display.value}`);
    } else {
        display.value = "Negative number not allowed!";
    }
};

// محاسبه سینوس هذلولوی
window.calculateSinh = function () {
    let display = document.getElementById("display");
    let value = parseFloat(display.value);

    if (!isNaN(value)) {
        display.value = Math.sinh(value);
        updateHistory(`sinh(${value}) = ${display.value}`);
    } else {
        display.value = "Invalid input!";
    }
};

// محاسبه کسینوس هذلولوی
window.calculateCosh = function () {
    let display = document.getElementById("display");
    let value = parseFloat(display.value);

    if (!isNaN(value)) {
        display.value = Math.cosh(value);
        updateHistory(`cosh(${value}) = ${display.value}`);
    } else {
        display.value = "Invalid input!";
    }
};

// محاسبه تانژانت هذلولوی
window.calculateTanh = function () {
    let display = document.getElementById("display");
    let value = parseFloat(display.value);

    if (!isNaN(value)) {
        display.value = Math.tanh(value);
        updateHistory(`tanh(${value}) = ${display.value}`);
    } else {
        display.value = "Invalid input!";
    }
};

// محاسبه مد (باقیمانده تقسیم)
window.calculateMod = function () {
    let display = document.getElementById("display");
    let value = parseFloat(display.value);
    let divisor = parseFloat(prompt("Enter the divisor:"));

    if (!isNaN(value) && !isNaN(divisor) && divisor !== 0) {
        display.value = value % divisor;
        updateHistory(`${value} mod ${divisor} = ${display.value}`);
    } else {
        display.value = "Invalid input or divisor!";
    }
};

// ... (بقیه کدهای قبلی بدون تغییر)