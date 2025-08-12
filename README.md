# PulseBoard Dashboard

A modern, responsive dashboard demo built for GitHub Pages with simulated real-time updates.

## 🚀 Features

- **Mock Authentication**: Client-side login with role-based access control
- **Interactive Charts**: Line, bar, and donut charts using Chart.js
- **Real-time Simulation**: Live activity feed with random events every 8-12 seconds
- **Role-based UI**: Admin/Viewer toggle that shows/hides edit controls
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Accessible**: Keyboard navigation and ARIA compliance
- **Sortable Tables**: Click column headers to sort user data

## 🎯 Demo Accounts

Use these credentials to test different user roles:

| Username | Password | Role |
|----------|----------|------|
| `admin` | `admin123` | Admin (full access) |
| `viewer` | `viewer123` | Viewer (read-only) |

## 🛠️ Local Development

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/pulseboard-dashboard.git
   cd pulseboard-dashboard
   \`\`\`

2. **Serve locally**
   
   Using Python:
   \`\`\`bash
   python -m http.server 8000
   \`\`\`
   
   Using Node.js:
   \`\`\`bash
   npx serve .
   \`\`\`
   
   Using PHP:
   \`\`\`bash
   php -S localhost:8000
   \`\`\`

3. **Open in browser**
   \`\`\`
   http://localhost:8000
   \`\`\`

## 🌐 GitHub Pages Deployment

1. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Enable GitHub Pages**
   - Go to repository Settings
   - Scroll to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"

3. **Access your dashboard**
   \`\`\`
   https://yourusername.github.io/pulseboard-dashboard/
   \`\`\`

## 📁 Project Structure

\`\`\`
pulseboard-dashboard/
├── index.html              # Login page
├── dashboard.html           # Main dashboard
├── assets/                  # Images and icons
│   ├── logo.png
│   ├── favicon.ico
│   └── avatar-*.png
├── scripts/
│   └── dashboard.js         # Dashboard functionality
├── data/
│   └── mock-data.json       # Sample data
└── README.md
\`\`\`

## 🔧 Customization

### Replacing Mock Data with Real API

To connect to a real backend API, modify `scripts/dashboard.js`:

\`\`\`javascript
// Replace this function in dashboard.js
async loadMockData() {
    try {
        // Change this URL to your API endpoint
        const response = await fetch('https://your-api.com/dashboard-data');
        this.mockData = await response.json();
    } catch (error) {
        console.error('Failed to load data:', error);
    }
}
\`\`\`

### Adding New Charts

1. Add a new canvas element to `dashboard.html`
2. Create the chart in `scripts/dashboard.js` using Chart.js
3. Update the mock data structure in `data/mock-data.json`

### Customizing Colors

The dashboard uses a consistent color scheme defined in the Tailwind config:

- **Primary**: `#0b1220` (dark blue)
- **Accent**: `#06b6d4` (cyan)
- **Accent Hover**: `#0891b2` (darker cyan)

## 🎮 Interactive Features

- **Live Notifications**: New activities appear every 8-12 seconds
- **Simulation Toggle**: Pause/resume the real-time simulation
- **Role Switching**: Toggle between Admin and Viewer modes
- **Table Sorting**: Click any column header to sort
- **Keyboard Navigation**: Full keyboard accessibility

## 🔒 Security Note

This is a **demo application** with client-side authentication only. For production use:

- Implement server-side authentication
- Add proper session management
- Validate permissions on the backend
- Use HTTPS for all communications

## 📊 Data Structure

The dashboard expects data in this format:

\`\`\`json
{
  "metrics": {
    "activeUsers": 1234,
    "revenue": 45231,
    "conversionRate": 3.24,
    "totalSessions": 89432
  },
  "activeUsersTimeSeries": [
    { "date": "2024-01-01", "users": 850 }
  ],
  "dailyRevenue": [
    { "date": "2024-01-01", "revenue": 5200 }
  ],
  "userRoles": [
    { "role": "Admin", "count": 12, "color": "#06b6d4" }
  ],
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "Admin",
      "status": "Active"
    }
  ]
}
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for your own dashboards!

---

**Built with ❤️ using vanilla JavaScript, Chart.js, and Tailwind CSS**
