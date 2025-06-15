# NyayGuru: AI-Powered Legal Assistant

NyayGuru (Justice Guru) is an AI-powered legal assistant application designed to provide legal information and assistance to users in India. The application features a chat interface where users can ask legal questions and receive informative responses with relevant citations and sources.

## Project Structure

The project is organized into the following main components:

### Backend (Flask/FastAPI)
- `app/` - Main application code
  - `api/` - API endpoints and routes
  - `core/` - Core functionality and business logic
  - `models/` - Database models
  - `services/` - Service layer for external integrations
  - `utils/` - Utility functions and helpers
  - `main.py` - Application entry point
  - `config.py` - Configuration settings
  - `database.py` - Database connection and setup
  - `dependencies.py` - Dependency injection
  - `middleware.py` - Request/response middleware

### Frontend (React)
- `lawgpt-frontend/` - React application
  - `src/` - Source code
    - `components/` - Reusable UI components
      - `chat/` - Chat-related components
      - `layout/` - Layout components like Header, Sidebar
      - `shared/` - Shared/common components
    - `context/` - React context providers
    - `pages/` - Page components
    - `services/` - API client and services
    - `styles/` - CSS and style files
    - `assets/` - Static assets like images
    - `App.jsx` - Main application component
    - `main.jsx` - Application entry point

### Configuration and Data
- `config/` - Configuration files
  - `.env` - Environment variables
  - `prometheus.yml` - Prometheus monitoring configuration
- `data/` - Data files and databases
  - `app.db` - SQLite database

### Docker and Deployment
- `Dockerfile` - Docker image definition
- `docker-compose.yml` - Docker Compose configuration
- `nginx/` - Nginx configuration for production

### Utilities and Scripts
- `scripts/` - Utility scripts
- `LEGAL-DATA/` - Legal data files for ingestion
- `static/` - Static files for the backend

## Setup and Installation

### Prerequisites
- Python 3.8+ 
- Node.js 14+
- SQLite (for development)

### Backend Setup
1. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```
   cp config/.env.example config/.env
   # Edit the .env file with your configuration
   ```

4. Run the application:
   ```
   python app/main.py
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd lawgpt-frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

### Using Docker
1. Build and start the containers:
   ```
   docker-compose up -d
   ```

2. Access the application at http://localhost:8000

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 