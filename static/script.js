// API Configuration
const API_BASE_URL = "http://localhost:5000/api";
let currentUserId = 0; // Demo user ID

// Demo Data (fallback if API is not available)
const demoData = {
  healthScore: 75,
  currentBalance: 15250000,
  monthlyIncome: 12500000,
  monthlyExpenses: 8750000,
  savingsRate: 30,
  recentTransactions: [
    {
      id: 1,
      description: "Chuyển tiền cho Nguyễn Văn A",
      amount: 500000,
      category: "transfer",
      type: "expense",
      date: "2024-01-15",
    },
    {
      id: 2,
      description: "Nhận lương tháng 1/2024",
      amount: 15000000,
      category: "income",
      type: "income",
      date: "2024-01-01",
    },
    {
      id: 3,
      description: "Thanh toán hóa đơn điện",
      amount: 150000,
      category: "bills",
      type: "expense",
      date: "2024-01-14",
    },
    {
      id: 4,
      description: "Mua sắm tại BigC",
      amount: 200000,
      category: "shopping",
      type: "expense",
      date: "2024-01-13",
    },
    {
      id: 5,
      description: "Ăn trưa tại nhà hàng",
      amount: 80000,
      category: "food",
      type: "expense",
      date: "2024-01-12",
    },
  ],
  allTransactions: [
    {
      id: 1,
      description: "Chuyển tiền cho Nguyễn Văn A",
      amount: 500000,
      category: "transfer",
      type: "expense",
      date: "2024-01-15",
    },
    {
      id: 2,
      description: "Nhận lương tháng 1/2024",
      amount: 15000000,
      category: "income",
      type: "income",
      date: "2024-01-01",
    },
    {
      id: 3,
      description: "Thanh toán hóa đơn điện",
      amount: 150000,
      category: "bills",
      type: "expense",
      date: "2024-01-14",
    },
    {
      id: 4,
      description: "Mua sắm tại BigC",
      amount: 200000,
      category: "shopping",
      type: "expense",
      date: "2024-01-13",
    },
    {
      id: 5,
      description: "Ăn trưa tại nhà hàng",
      amount: 80000,
      category: "food",
      type: "expense",
      date: "2024-01-12",
    },
    {
      id: 6,
      description: "Mua xăng xe máy",
      amount: 50000,
      category: "transport",
      type: "expense",
      date: "2024-01-11",
    },
    {
      id: 7,
      description: "Thanh toán học phí con",
      amount: 3000000,
      category: "education",
      type: "expense",
      date: "2024-01-10",
    },
    {
      id: 8,
      description: "Mua thuốc tại nhà thuốc",
      amount: 120000,
      category: "health",
      type: "expense",
      date: "2024-01-09",
    },
    {
      id: 9,
      description: "Mua đồ chơi cho con",
      amount: 150000,
      category: "entertainment",
      type: "expense",
      date: "2024-01-08",
    },
    {
      id: 10,
      description: "Rút tiền ATM Vietcombank",
      amount: 1000000,
      category: "withdrawal",
      type: "expense",
      date: "2024-01-07",
    },
  ],
  recommendations: [
    {
      action: "Giảm chi tiêu ăn uống xuống 15%",
      expectedImpact: "+120,000 VND/tháng",
      reason: "Dựa trên phân tích chi tiêu của bạn",
      confidence: 0.8,
    },
    {
      action: "Lập ngân sách chi tiêu hàng tháng",
      expectedImpact: "-10% tổng chi tiêu",
      reason: "Dựa trên pattern chi tiêu hiện tại",
      confidence: 0.7,
    },
    {
      action: "Đầu tư vào quỹ tương hỗ",
      expectedImpact: "+8% lợi nhuận dài hạn",
      reason: "Người dùng có điểm số tương tự đã thành công",
      confidence: 0.75,
    },
    {
      action: "Tự động tiết kiệm 10% thu nhập mỗi tháng",
      expectedImpact: "+1,250,000 VND/tháng",
      reason: "Dựa trên thành công của người dùng có pattern chi tiêu tương tự",
      confidence: 0.85,
    },
    {
      action: "Tìm kiếm ưu đãi khi mua sắm",
      expectedImpact: "-5% chi tiêu mua sắm",
      reason: "Dựa trên phân tích chi tiêu của bạn",
      confidence: 0.6,
    },
  ],
  forecastData: {
    weeks: ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"],
    amounts: [2300000, 2400000, 2200000, 2300000],
  },
  categoryData: {
    labels: [
      "Ăn uống",
      "Giao thông",
      "Mua sắm",
      "Hóa đơn",
      "Sức khỏe",
      "Giáo dục",
      "Giải trí",
    ],
    amounts: [800000, 500000, 200000, 150000, 120000, 3000000, 150000],
  },
};

// Chart instances
let forecastChart = null;
let categoryChart = null;

// Initialize the app
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});

function initializeApp() {
  // Load data from API
  loadDashboardData();
  loadTransactions();
  loadInsights();
  loadRecommendations();

  // Setup event listeners
  setupEventListeners();
}

// API Functions
async function loadDashboardData() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/dashboard?user_id=${currentUserId}`
    );
    const data = await response.json();

    // Update dashboard with real data
    document.getElementById("healthScore").textContent = data.healthScore;
    document.getElementById("currentBalance").textContent = formatCurrency(
      data.currentBalance
    );
    document.getElementById("monthlyIncome").textContent = formatCurrency(
      data.monthlyIncome
    );
    document.getElementById("monthlyExpenses").textContent = formatCurrency(
      data.monthlyExpenses
    );
    document.getElementById("savingsRate").textContent = data.savingsRate + "%";

    // Update recent transactions
    updateRecentTransactionsFromAPI(data.recentTransactions);
  } catch (error) {
    console.log("Using fallback data:", error);
    updateDashboard();
  }
}

async function loadTransactions() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/transactions?user_id=${currentUserId}`
    );
    const data = await response.json();

    updateTransactionsFromAPI(data.transactions);
  } catch (error) {
    console.log("Using fallback data:", error);
    updateTransactions();
  }
}

async function loadInsights() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/insights?user_id=${currentUserId}`
    );
    const data = await response.json();

    // Update forecast data
    demoData.forecastData = data.forecast;
    demoData.categoryData = data.categoryBreakdown;

    initializeCharts();
  } catch (error) {
    console.log("Using fallback data:", error);
    initializeCharts();
  }
}

async function loadRecommendations() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/recommendations?user_id=${currentUserId}`
    );
    const data = await response.json();

    updateRecommendationsFromAPI(data.recommendations);
  } catch (error) {
    console.log("Using fallback data:", error);
    updateRecommendations();
  }
}

function updateRecentTransactionsFromAPI(transactions) {
  const container = document.getElementById("recentTransactions");
  container.innerHTML = "";

  transactions.forEach((transaction) => {
    const transactionElement = createTransactionElement(transaction);
    container.appendChild(transactionElement);
  });
}

function updateTransactionsFromAPI(transactions) {
  const container = document.getElementById("allTransactions");
  container.innerHTML = "";

  transactions.forEach((transaction) => {
    const transactionElement = createTransactionElement(transaction);
    container.appendChild(transactionElement);
  });
}

function updateRecommendationsFromAPI(recommendations) {
  const container = document.getElementById("recommendationsList");
  container.innerHTML = "";

  recommendations.forEach((rec, index) => {
    const div = document.createElement("div");
    div.className = "recommendation-item";

    div.innerHTML = `
            <div class="recommendation-title">${rec.action}</div>
            <div class="recommendation-impact">Tác động: ${
              rec.expected_impact
            }</div>
            <div class="recommendation-reason">${rec.reason}</div>
            <div class="recommendation-confidence">Độ tin cậy: ${Math.round(
              rec.confidence * 100
            )}%</div>
        `;

    container.appendChild(div);
  });
}

function setupEventListeners() {
  // Tab navigation
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", function () {
      const tabId = this.dataset.tab;
      switchTab(tabId);
    });
  });

  // Filter buttons
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const filter = this.dataset.filter;
      filterTransactions(filter);

      // Update active state
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // Search functionality
  document
    .getElementById("transactionSearch")
    .addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase();
      searchTransactions(searchTerm);
    });

  // Simulation slider
  document
    .getElementById("reductionSlider")
    .addEventListener("input", function () {
      document.getElementById("reductionValue").textContent = this.value + "%";
    });
}

function switchTab(tabId) {
  // Hide all tab contents
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.remove("active");
  });

  // Show selected tab content
  document.getElementById(tabId).classList.add("active");

  // Update tab active state
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.remove("active");
  });
  document.querySelector(`[data-tab="${tabId}"]`).classList.add("active");

  // Initialize charts if switching to insights tab
  if (tabId === "insights") {
    setTimeout(() => {
      initializeCharts();
    }, 100);
  }
}

function updateDashboard() {
  // Update health score
  document.getElementById("healthScore").textContent = demoData.healthScore;

  // Update balance
  document.getElementById("currentBalance").textContent = formatCurrency(
    demoData.currentBalance
  );

  // Update quick stats
  document.getElementById("monthlyIncome").textContent = formatCurrency(
    demoData.monthlyIncome
  );
  document.getElementById("monthlyExpenses").textContent = formatCurrency(
    demoData.monthlyExpenses
  );
  document.getElementById("savingsRate").textContent =
    demoData.savingsRate + "%";

  // Update recent transactions
  updateRecentTransactions();
}

function updateRecentTransactions() {
  const container = document.getElementById("recentTransactions");
  container.innerHTML = "";

  demoData.recentTransactions.forEach((transaction) => {
    const transactionElement = createTransactionElement(transaction);
    container.appendChild(transactionElement);
  });
}

function updateTransactions() {
  const container = document.getElementById("allTransactions");
  container.innerHTML = "";

  demoData.allTransactions.forEach((transaction) => {
    const transactionElement = createTransactionElement(transaction);
    container.appendChild(transactionElement);
  });
}

function createTransactionElement(transaction) {
  const div = document.createElement("div");
  div.className = "transaction-item";

  const iconClass = getTransactionIconClass(transaction.category);
  const amountClass = transaction.type === "income" ? "positive" : "negative";

  div.innerHTML = `
        <div class="transaction-icon ${transaction.category}">
            <i class="${iconClass}"></i>
        </div>
        <div class="transaction-info">
            <div class="transaction-description">${
              transaction.description
            }</div>
            <div class="transaction-category">${getCategoryName(
              transaction.category
            )}</div>
        </div>
        <div class="transaction-amount ${amountClass}">
            ${transaction.type === "income" ? "+" : "-"}${formatCurrency(
    transaction.amount
  )}
        </div>
    `;

  return div;
}

function getTransactionIconClass(category) {
  const icons = {
    income: "fas fa-arrow-down",
    food: "fas fa-utensils",
    transport: "fas fa-car",
    shopping: "fas fa-shopping-bag",
    bills: "fas fa-file-invoice",
    health: "fas fa-heart",
    education: "fas fa-graduation-cap",
    entertainment: "fas fa-gamepad",
    transfer: "fas fa-exchange-alt",
    withdrawal: "fas fa-money-bill-wave",
  };
  return icons[category] || "fas fa-question";
}

function getCategoryName(category) {
  const names = {
    income: "Thu nhập",
    food: "Ăn uống",
    transport: "Giao thông",
    shopping: "Mua sắm",
    bills: "Hóa đơn",
    health: "Sức khỏe",
    education: "Giáo dục",
    entertainment: "Giải trí",
    transfer: "Chuyển khoản",
    withdrawal: "Rút tiền",
  };
  return names[category] || category;
}

function filterTransactions(filter) {
  const container = document.getElementById("allTransactions");
  container.innerHTML = "";

  let filteredTransactions = demoData.allTransactions;

  if (filter !== "all") {
    if (filter === "income") {
      filteredTransactions = demoData.allTransactions.filter(
        (t) => t.type === "income"
      );
    } else if (filter === "expense") {
      filteredTransactions = demoData.allTransactions.filter(
        (t) => t.type === "expense"
      );
    } else if (filter === "transfer") {
      filteredTransactions = demoData.allTransactions.filter(
        (t) => t.category === "transfer"
      );
    }
  }

  filteredTransactions.forEach((transaction) => {
    const transactionElement = createTransactionElement(transaction);
    container.appendChild(transactionElement);
  });
}

function searchTransactions(searchTerm) {
  const container = document.getElementById("allTransactions");
  container.innerHTML = "";

  const filteredTransactions = demoData.allTransactions.filter(
    (transaction) =>
      transaction.description.toLowerCase().includes(searchTerm) ||
      getCategoryName(transaction.category).toLowerCase().includes(searchTerm)
  );

  filteredTransactions.forEach((transaction) => {
    const transactionElement = createTransactionElement(transaction);
    container.appendChild(transactionElement);
  });
}

function initializeCharts() {
  // Destroy existing charts
  if (forecastChart) {
    forecastChart.destroy();
  }
  if (categoryChart) {
    categoryChart.destroy();
  }

  // Initialize forecast chart
  const forecastCtx = document.getElementById("forecastChart");
  if (forecastCtx) {
    forecastChart = new Chart(forecastCtx, {
      type: "line",
      data: {
        labels: demoData.forecastData.weeks,
        datasets: [
          {
            label: "Chi tiêu dự báo",
            data: demoData.forecastData.amounts,
            borderColor: "#667eea",
            backgroundColor: "rgba(102, 126, 234, 0.1)",
            borderWidth: 3,
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return formatCurrency(value);
              },
            },
          },
        },
      },
    });
  }

  // Initialize category chart
  const categoryCtx = document.getElementById("categoryChart");
  if (categoryCtx) {
    categoryChart = new Chart(categoryCtx, {
      type: "doughnut",
      data: {
        labels: demoData.categoryData.labels,
        datasets: [
          {
            data: demoData.categoryData.amounts,
            backgroundColor: [
              "#667eea",
              "#764ba2",
              "#f093fb",
              "#f5576c",
              "#4facfe",
              "#00f2fe",
              "#43e97b",
            ],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              padding: 20,
              usePointStyle: true,
            },
          },
        },
      },
    });
  }

  // Update forecast amount
  const totalForecast = demoData.forecastData.amounts.reduce(
    (sum, amount) => sum + amount,
    0
  );
  document.getElementById("forecastAmount").textContent =
    formatCurrency(totalForecast);
}

function updateRecommendations() {
  const container = document.getElementById("recommendationsList");
  container.innerHTML = "";

  demoData.recommendations.forEach((rec, index) => {
    const div = document.createElement("div");
    div.className = "recommendation-item";

    div.innerHTML = `
            <div class="recommendation-title">${rec.action}</div>
            <div class="recommendation-impact">Tác động: ${
              rec.expectedImpact
            }</div>
            <div class="recommendation-reason">${rec.reason}</div>
            <div class="recommendation-confidence">Độ tin cậy: ${Math.round(
              rec.confidence * 100
            )}%</div>
        `;

    container.appendChild(div);
  });
}

async function runSimulation() {
  const category = document.getElementById("simulationCategory").value;
  const reductionPercent = document.getElementById("reductionSlider").value;

  try {
    const response = await fetch(`${API_BASE_URL}/simulation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: currentUserId,
        category: category,
        reduction_percent: parseInt(reductionPercent),
      }),
    });

    const data = await response.json();

    const resultDiv = document.getElementById("simulationResult");
    resultDiv.innerHTML = `
            <h4>Kết quả mô phỏng:</h4>
            <div style="white-space: pre-line;">${data.result}</div>
        `;
  } catch (error) {
    console.log("Using fallback simulation:", error);

    // Fallback calculation
    const categoryAmount =
      demoData.categoryData.amounts[
        demoData.categoryData.labels.indexOf(getCategoryName(category))
      ] || 0;
    const reductionAmount = categoryAmount * (reductionPercent / 100);
    const monthlySavings = reductionAmount * 4;

    const resultDiv = document.getElementById("simulationResult");
    resultDiv.innerHTML = `
            <h4>Kết quả mô phỏng:</h4>
            <p><strong>Giảm ${reductionPercent}% chi tiêu cho ${getCategoryName(
      category
    )}</strong></p>
            <p>Tiết kiệm thêm: <strong>${formatCurrency(
              monthlySavings
            )}/tháng</strong></p>
            <p>Tỷ lệ tiết kiệm tăng: <strong>${(
              (monthlySavings / demoData.monthlyIncome) *
              100
            ).toFixed(1)}%</strong></p>
            <p>Độ tin cậy: <strong>85%</strong> (dựa trên mô phỏng số học)</p>
        `;
  }
}

function showAddTransaction() {
  document.getElementById("addTransactionModal").style.display = "flex";
}

function hideAddTransaction() {
  document.getElementById("addTransactionModal").style.display = "none";
}

async function addTransaction() {
  const description = document.getElementById("transactionDescription").value;
  const amount = parseInt(document.getElementById("transactionAmount").value);
  const category = document.getElementById("transactionCategory").value;

  if (!description || !amount) {
    alert("Vui lòng điền đầy đủ thông tin");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/add-transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: currentUserId,
        transaction: {
          description: description,
          amount: amount,
          category: category,
          raw_text: description,
        },
      }),
    });

    const data = await response.json();

    if (data.success) {
      // Reload data from API
      loadDashboardData();
      loadTransactions();

      // Hide modal
      hideAddTransaction();

      // Clear form
      document.getElementById("transactionDescription").value = "";
      document.getElementById("transactionAmount").value = "";
      document.getElementById("transactionCategory").value = "income";

      alert("Giao dịch đã được thêm thành công!");
    }
  } catch (error) {
    console.log("Using fallback add transaction:", error);

    // Fallback: add to local data
    const newTransaction = {
      id: Date.now(),
      description: description,
      amount: amount,
      category: category,
      type: category === "income" ? "income" : "expense",
      date: new Date().toISOString().split("T")[0],
    };

    // Add to data
    demoData.allTransactions.unshift(newTransaction);
    demoData.recentTransactions.unshift(newTransaction);

    // Keep only 5 recent transactions
    if (demoData.recentTransactions.length > 5) {
      demoData.recentTransactions = demoData.recentTransactions.slice(0, 5);
    }

    // Update UI
    updateTransactions();
    updateRecentTransactions();

    // Update balance
    if (category === "income") {
      demoData.currentBalance += amount;
      demoData.monthlyIncome += amount;
    } else {
      demoData.currentBalance -= amount;
      demoData.monthlyExpenses += amount;
    }

    // Update dashboard
    updateDashboard();

    // Hide modal
    hideAddTransaction();

    // Clear form
    document.getElementById("transactionDescription").value = "";
    document.getElementById("transactionAmount").value = "";
    document.getElementById("transactionCategory").value = "income";
  }
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount);
}

// Close modal when clicking outside
document.addEventListener("click", function (event) {
  const modal = document.getElementById("addTransactionModal");
  if (event.target === modal) {
    hideAddTransaction();
  }
});

// Prevent modal content clicks from closing modal
document
  .querySelector(".modal-content")
  .addEventListener("click", function (event) {
    event.stopPropagation();
  });
