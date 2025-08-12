// Dashboard functionality for PulseBoard
class PulseBoard {
  constructor() {
    this.mockData = null
    this.charts = {}
    this.simulationActive = true
    this.simulationInterval = null
    this.currentUser = null
    this.sortOrder = {}

    this.init()
  }

  async init() {
    // Check authentication
    this.checkAuth()

    // Load mock data
    await this.loadMockData()

    // Initialize UI
    this.initializeUI()

    // Create charts
    this.createCharts()

    // Populate user table
    this.populateUserTable()

    // Start simulation
    this.startSimulation()

    // Setup event listeners
    this.setupEventListeners()

    // Setup keyboard navigation
    this.setupKeyboardNavigation()
  }

  checkAuth() {
    const userData = localStorage.getItem("pulseboardUser")
    if (!userData) {
      window.location.href = "index.html"
      return
    }

    this.currentUser = JSON.parse(userData)
    this.updateUserInfo()
    this.updateRoleBasedUI()
  }

  async loadMockData() {
    try {
      const response = await fetch("data/mock-data.json")
      this.mockData = await response.json()
    } catch (error) {
      console.error("Failed to load mock data:", error)
      // Fallback data
      this.mockData = {
        metrics: { activeUsers: 1234, revenue: 45231, conversionRate: 3.24, totalSessions: 89432 },
        activeUsersTimeSeries: [],
        dailyRevenue: [],
        userRoles: [],
        users: [],
        activityTemplates: [],
      }
    }
  }

  initializeUI() {
    // Update metrics
    document.getElementById("activeUsers").textContent = this.mockData.metrics.activeUsers.toLocaleString()
    document.getElementById("revenue").textContent = "$" + this.mockData.metrics.revenue.toLocaleString()
    document.getElementById("conversionRate").textContent = this.mockData.metrics.conversionRate + "%"
    document.getElementById("totalSessions").textContent = this.mockData.metrics.totalSessions.toLocaleString()

    // Initialize activity feed
    this.initializeActivityFeed()
  }

  updateUserInfo() {
    document.getElementById("userName").textContent = this.currentUser.username
    document.getElementById("userAvatar").src = `assets/avatar-${this.currentUser.role}.png`
    document.getElementById("roleToggle").value = this.currentUser.role
  }

  updateRoleBasedUI() {
    const isAdmin = this.currentUser.role === "admin"
    const adminElements = document.querySelectorAll(".admin-only")

    adminElements.forEach((element) => {
      element.style.display = isAdmin ? "block" : "none"
      if (element.tagName === "BUTTON" || element.tagName === "SELECT") {
        element.style.display = isAdmin ? "inline-block" : "none"
      }
    })
  }

  createCharts() {
    this.createActiveUsersChart()
    this.createRevenueChart()
    this.createUserRolesChart()
  }

  createActiveUsersChart() {
    const ctx = document.getElementById("activeUsersChart").getContext("2d")
    const data = this.mockData.activeUsersTimeSeries

    this.charts.activeUsers = new window.Chart(ctx, {
      type: "line",
      data: {
        labels: data.map((item) => new Date(item.date).toLocaleDateString()),
        datasets: [
          {
            label: "Active Users",
            data: data.map((item) => item.users),
            borderColor: "#06b6d4",
            backgroundColor: "rgba(6, 182, 212, 0.1)",
            borderWidth: 2,
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
            grid: {
              color: "rgba(0, 0, 0, 0.1)",
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    })
  }

  createRevenueChart() {
    const ctx = document.getElementById("revenueChart").getContext("2d")
    const data = this.mockData.dailyRevenue

    this.charts.revenue = new window.Chart(ctx, {
      type: "bar",
      data: {
        labels: data.map((item) => new Date(item.date).toLocaleDateString()),
        datasets: [
          {
            label: "Daily Revenue",
            data: data.map((item) => item.revenue),
            backgroundColor: "#10b981",
            borderColor: "#059669",
            borderWidth: 1,
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
            grid: {
              color: "rgba(0, 0, 0, 0.1)",
            },
            ticks: {
              callback: (value) => "$" + value.toLocaleString(),
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    })
  }

  createUserRolesChart() {
    const ctx = document.getElementById("userRolesChart").getContext("2d")
    const data = this.mockData.userRoles

    this.charts.userRoles = new window.Chart(ctx, {
      type: "doughnut",
      data: {
        labels: data.map((item) => item.role),
        datasets: [
          {
            data: data.map((item) => item.count),
            backgroundColor: data.map((item) => item.color),
            borderWidth: 2,
            borderColor: "#ffffff",
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
    })
  }

  populateUserTable() {
    const tbody = document.getElementById("userTableBody")
    tbody.innerHTML = ""

    this.mockData.users.forEach((user) => {
      const row = document.createElement("tr")
      row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <img class="h-8 w-8 rounded-full" src="${user.avatar}" alt="${user.name}">
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">${user.name}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${user.email}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        ${user.role}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}">
                        ${user.status}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="admin-only text-accent hover:text-accent-hover mr-3">Edit</button>
                    <button class="admin-only text-red-600 hover:text-red-900">Delete</button>
                </td>
            `
      tbody.appendChild(row)
    })

    // Update role-based UI for new elements
    this.updateRoleBasedUI()
  }

  initializeActivityFeed() {
    const feed = document.getElementById("activityFeed")

    // Add some initial activities
    const initialActivities = [
      { text: "System backup completed successfully", time: "2 minutes ago", type: "system" },
      { text: "New user Sarah Wilson registered", time: "5 minutes ago", type: "user" },
      { text: "Payment of $1,250 received from John Doe", time: "8 minutes ago", type: "payment" },
      { text: "User Mike Johnson updated their profile", time: "12 minutes ago", type: "user" },
    ]

    initialActivities.forEach((activity) => {
      this.addActivityItem(activity.text, activity.time, activity.type)
    })
  }

  addActivityItem(text, time, type = "system") {
    const feed = document.getElementById("activityFeed")
    const item = document.createElement("div")
    item.className = "flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"

    const iconColors = {
      system: "bg-blue-100 text-blue-600",
      user: "bg-green-100 text-green-600",
      payment: "bg-yellow-100 text-yellow-600",
    }

    item.innerHTML = `
            <div class="flex-shrink-0 w-8 h-8 ${iconColors[type] || iconColors.system} rounded-full flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-sm text-gray-900">${text}</p>
                <p class="text-xs text-gray-500">${time}</p>
            </div>
        `

    // Add to top of feed
    feed.insertBefore(item, feed.firstChild)

    // Remove old items if too many
    while (feed.children.length > 10) {
      feed.removeChild(feed.lastChild)
    }

    // Show notification
    this.showNotification(text, type)
  }

  showNotification(text, type = "info") {
    const container = document.getElementById("notificationContainer")
    const notification = document.createElement("div")

    const bgColors = {
      info: "bg-blue-500",
      success: "bg-green-500",
      warning: "bg-yellow-500",
      error: "bg-red-500",
    }

    notification.className = `${bgColors[type] || bgColors.info} text-white px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full opacity-0`
    notification.innerHTML = `
            <div class="flex items-center justify-between">
                <span class="text-sm">${text}</span>
                <button class="ml-3 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `

    container.appendChild(notification)

    // Animate in
    setTimeout(() => {
      notification.classList.remove("translate-x-full", "opacity-0")
    }, 100)

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.classList.add("translate-x-full", "opacity-0")
        setTimeout(() => {
          if (notification.parentElement) {
            notification.remove()
          }
        }, 300)
      }
    }, 5000)
  }

  startSimulation() {
    if (!this.simulationActive) return

    const generateRandomActivity = () => {
      const templates = this.mockData.activityTemplates
      const users = this.mockData.users
      const template = templates[Math.floor(Math.random() * templates.length)]
      const user = users[Math.floor(Math.random() * users.length)]

      const activity = template
        .replace("{name}", user.name)
        .replace("{role}", user.role)
        .replace("{amount}", Math.floor(Math.random() * 5000) + 100)

      const timeAgo = "Just now"
      const type = template.includes("Payment") ? "payment" : template.includes("User") ? "user" : "system"

      this.addActivityItem(activity, timeAgo, type)

      // Update metrics randomly
      this.updateMetricsRandomly()
    }

    // Generate activity every 8-12 seconds
    const scheduleNext = () => {
      if (this.simulationActive) {
        const delay = Math.random() * 4000 + 8000 // 8-12 seconds
        this.simulationInterval = setTimeout(() => {
          generateRandomActivity()
          scheduleNext()
        }, delay)
      }
    }

    scheduleNext()
  }

  updateMetricsRandomly() {
    // Small random updates to metrics
    const activeUsersEl = document.getElementById("activeUsers")
    const revenueEl = document.getElementById("revenue")
    const sessionsEl = document.getElementById("totalSessions")

    const currentUsers = Number.parseInt(activeUsersEl.textContent.replace(/,/g, ""))
    const currentRevenue = Number.parseInt(revenueEl.textContent.replace(/[$,]/g, ""))
    const currentSessions = Number.parseInt(sessionsEl.textContent.replace(/,/g, ""))

    // Small random changes
    const userChange = Math.floor(Math.random() * 20) - 10
    const revenueChange = Math.floor(Math.random() * 1000) - 500
    const sessionChange = Math.floor(Math.random() * 100) - 50

    activeUsersEl.textContent = Math.max(0, currentUsers + userChange).toLocaleString()
    revenueEl.textContent = "$" + Math.max(0, currentRevenue + revenueChange).toLocaleString()
    sessionsEl.textContent = Math.max(0, currentSessions + sessionChange).toLocaleString()
  }

  setupEventListeners() {
    // Logout button
    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("pulseboardUser")
      window.location.href = "index.html"
    })

    // Role toggle
    document.getElementById("roleToggle").addEventListener("change", (e) => {
      this.currentUser.role = e.target.value
      localStorage.setItem("pulseboardUser", JSON.stringify(this.currentUser))
      this.updateUserInfo()
      this.updateRoleBasedUI()
    })

    // Simulation toggle
    document.getElementById("simulationToggle").addEventListener("click", (e) => {
      this.simulationActive = !this.simulationActive
      e.target.textContent = this.simulationActive ? "Pause Simulation" : "Resume Simulation"
      e.target.classList.toggle("bg-red-500", !this.simulationActive)
      e.target.classList.toggle("bg-accent", this.simulationActive)

      if (this.simulationActive) {
        this.startSimulation()
      } else {
        clearTimeout(this.simulationInterval)
      }
    })

    // Table sorting
    document.querySelectorAll("[data-sort]").forEach((header) => {
      header.addEventListener("click", () => {
        const sortKey = header.dataset.sort
        this.sortTable(sortKey)
      })
    })
  }

  sortTable(key) {
    const isAscending = this.sortOrder[key] !== "asc"
    this.sortOrder = {} // Reset other sorts
    this.sortOrder[key] = isAscending ? "asc" : "desc"

    this.mockData.users.sort((a, b) => {
      let aVal = a[key]
      let bVal = b[key]

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }

      if (isAscending) {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })

    this.populateUserTable()
  }

  setupKeyboardNavigation() {
    // Add tabindex to interactive elements
    const interactiveElements = document.querySelectorAll(".metric-card, .edit-btn, [data-sort]")
    interactiveElements.forEach((el, index) => {
      el.setAttribute("tabindex", "0")

      // Add keyboard event listeners
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          el.click()
        }
      })
    })

    // Focus management
    document.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        // Custom tab navigation logic could go here
      }
    })
  }
}

// Initialize dashboard when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new PulseBoard()
})
