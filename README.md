# 🍎 Fruit Management Fullstack Application

A simple fullstack application built with React, Node.js, Express, PostgreSQL, and Docker for managing fruit inventory.

### Frontend:
<img width="1469" height="831" alt="Screenshot 2025-09-01 at 12 10 26 AM" src="https://github.com/user-attachments/assets/8e1c4d76-c657-42de-8c3d-3ff324870255" />

### Prometheus dasboard:
<img width="1467" height="832" alt="Screenshot 2025-09-01 at 12 10 12 AM" src="https://github.com/user-attachments/assets/ee577ec5-134f-428e-898e-0702444fede7" />

## 🏗️ Architecture

- **Frontend**: React with Vite, modern UI with responsive design
- **Backend**: Node.js + Express REST API
- **Database**: PostgreSQL with persistent storage
- **Containerization**: Docker with docker-compose orchestration

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Git (for cloning the repository)

### Running the Application

1. **Clone and navigate to the project directory**
   ```bash
   cd fruit-fullstack
   ```

2. **Start all services with Docker Compose**
   ```bash
   docker compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Database: localhost:5432
   - Prometheus: http://localhost:9090

## 📋 API Endpoints

### Health Check
```bash
GET /health
# Returns: { "status": "ok" }
```

### Get All Fruits
```bash
GET /fruits
# Returns: Array of fruit objects
```

### Metrics Endpoint
```bash
GET /metrics
# Returns: Prometheus metrics in text format
```

### Add New Fruit
```bash
POST /fruits
Content-Type: application/json

{
  "fruit_name": "Apple",
  "fruit_count": 10
}
```

## 🧪 Testing the API

### Using curl

1. **Health Check**
   ```bash
   curl http://localhost:8000/health
   ```

2. **Get All Fruits**
   ```bash
   curl http://localhost:8000/fruits
   ```

3. **Add New Fruit**
   ```bash
   curl -X POST http://localhost:8000/fruits \
     -H "Content-Type: application/json" \
     -d '{"fruit_name": "Mango", "fruit_count": 5}'
   ```

## 📊 Prometheus Monitoring

### Example Queries

1. **Total HTTP Requests**
   ```
   http_requests_total
   ```

2. **Request Duration by Route**
   ```
   http_request_duration_seconds{route="/fruits"}
   ```

3. **Request Count by Status Code**
   ```
   http_requests_total{status_code="200"}
   ```

4. **Node.js Memory Usage**
   ```
   nodejs_heap_size_total_bytes
   ```

5. **Request Rate (requests per second)**
   ```
   rate(http_requests_total[5m])
   ```

### How to Use

1. **Access Prometheus**: http://localhost:9090
2. **Go to Query tab**: Enter any query above in the expression field
3. **Click Execute**: View results in Table or Graph format
4. **Adjust time range**: Use the time controls to see historical data

### Using Postman

1. Import the following collection:
   - **GET** `http://localhost:8000/health`
   - **GET** `http://localhost:8000/fruits`
   - **POST** `http://localhost:8000/fruits` with JSON body

## 🐳 Docker Services

### Service Details

- **frontend**: React app served by Nginx (port 3000)
- **backend**: Node.js Express API (port 8000)
- **db**: PostgreSQL database (port 5432)
- **prometheus**: Monitoring server (port 9090)

### Network Configuration

- All services communicate via the `fruit_network` Docker network
- Frontend → Backend: `http://backend:8000`
- Backend → Database: `db:5432`

### Volumes

- `postgres_data`: Persistent PostgreSQL data storage
- Database initialization script mounted to `/docker-entrypoint-initdb.d/`

## 🛠️ Development

### Project Structure
```
fruit-fullstack/
├── frontend/           # React application
│   ├── src/           # Source code
│   ├── public/        # Static assets
│   ├── Dockerfile     # Frontend container
│   └── package.json   # Dependencies
├── backend/           # Node.js API
│   ├── server.js      # Express server
│   ├── Dockerfile     # Backend container
│   └── package.json   # Dependencies
├── docker-compose.yml # Service orchestration
├── init.sql          # Database initialization
└── README.md         # This file
```

### Local Development

1. **Backend Development**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Frontend Development**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Database Connection**
   - Use the same environment variables as defined in `docker-compose.yml`
   - Ensure PostgreSQL is running on port 5432

## 🔧 Configuration

### Environment Variables

The application uses the following environment variables:

- `DB_HOST`: Database host (default: `db`)
- `DB_PORT`: Database port (default: `5432`)
- `DB_NAME`: Database name (default: `fruits_db`)
- `DB_USER`: Database user (default: `postgres`)
- `DB_PASSWORD`: Database password (default: `postgres`)
- `PORT`: Backend API port (default: `8000`)

### Database Schema

```sql
CREATE TABLE fruits (
    id SERIAL PRIMARY KEY,
    fruit_name VARCHAR(100) NOT NULL,
    fruit_count INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000, 8000, 5432, and 9090 are available
2. **Database connection**: Wait for PostgreSQL to fully initialize before starting backend
3. **Build failures**: Clear Docker cache with `docker system prune -a`

### Logs and Debugging

```bash
# View all service logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db

# Access running containers
docker-compose exec backend sh
docker-compose exec db psql -U postgres -d fruits_db
```

## 🧹 Cleanup

### Stop and Remove Services
```bash
docker-compose down
```

### Remove All Data (including volumes)
```bash
docker-compose down -v
docker system prune -a
```

## 📝 Features

- ✅ Add fruits with name and count
- ✅ Real-time table updates
- ✅ Responsive design
- ✅ Form validation
- ✅ Error handling
- ✅ Persistent data storage
- ✅ Docker containerization
- ✅ Health check endpoint
- ✅ CORS enabled for frontend-backend communication

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Happy Coding! 🚀**
