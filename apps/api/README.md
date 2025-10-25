# Visume AI API

Express.js REST API server for the Visume AI platform - an AI-powered resume optimization service.

## Features

- **Authentication**: Clerk-based user authentication with webhook support
- **AI Services**: Resume analysis, tailoring, and optimization using OpenAI & LangChain
- **Database**: MongoDB with Mongoose ODM
- **Caching**: Redis for rate limiting and caching
- **File Storage**: Local and AWS S3 support for resume uploads
- **Email**: Automated email notifications using nodemailer
- **WebSocket**: Real-time updates for AI operations
- **Validation**: Request validation with express-validator
- **Logging**: Winston-based structured logging

## Tech Stack

- **Runtime**: Node.js >= 20
- **Framework**: Express.js 5
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose)
- **Cache**: Redis
- **Authentication**: Clerk
- **AI/ML**: OpenAI SDK + LangChain
- **Testing**: Jest + Supertest

## Project Structure

```
apps/api/
├── src/
│   ├── config/          # Database, Redis, Clerk configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth, validation, error handling
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic (AI, email, file storage)
│   ├── scripts/         # Database utilities (seed, migrate)
│   ├── utils/           # Helper functions and utilities
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── dist/                # Compiled JavaScript (gitignored)
├── logs/                # Application logs (gitignored)
├── uploads/             # Local file uploads (gitignored)
└── package.json
```

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm 10.4.1 (enforced by package manager)
- MongoDB (local or Atlas)
- Redis (optional but recommended)

### Installation

From the project root:

```bash
# Install all dependencies
pnpm install

# Or install only API dependencies
pnpm --filter @visume/api install
```

### Environment Setup

1. Copy the example environment file:

   ```bash
   cp .env.example .env.development
   ```

2. Fill in the required environment variables:

#### Required Variables

- **CLERK_SECRET_KEY**: Get from [Clerk Dashboard](https://dashboard.clerk.com)
- **CLERK_WEBHOOK_SECRET**: Create webhook endpoint in Clerk
- **OPENAI_API_KEY**: Get from [OpenAI Platform](https://platform.openai.com/api-keys)

#### Database

- **MONGODB_URI**: MongoDB connection string
  - Local: `mongodb://localhost:27017/visume_ai_dev`
  - Atlas: `mongodb+srv://username:password@cluster.mongodb.net/visume_ai`

#### Optional but Recommended

- **REDIS_URL**: Redis connection URL (for caching and rate limiting)
- **SMTP\_\***: Email configuration for notifications

See [.env.example](.env.example) for complete configuration options.

### Running the API

```bash
# Development mode with hot reload
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

### Database Operations

```bash
# Seed the database with initial data
pnpm db:seed

# Run database migrations
pnpm db:migrate

# Reset user credits (utility)
pnpm credits:reset
```

## API Endpoints

### Authentication

- `POST /api/auth/webhook` - Clerk webhook for user sync

### Resumes

- `GET /api/resumes` - Get all user resumes
- `GET /api/resumes/:id` - Get single resume
- `POST /api/resumes` - Create new resume
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume (soft delete)
- `POST /api/resumes/:id/duplicate` - Duplicate resume
- `GET /api/resumes/:id/export` - Export resume (PDF/DOCX/JSON)

### AI Features

- `POST /api/ai/analyze` - Analyze resume with ATS scoring
- `POST /api/ai/tailor` - Get tailoring suggestions
- `POST /api/ai/summary` - Generate professional summary
- `POST /api/ai/keywords` - Extract keywords from job description
- `POST /api/ai/match` - Calculate resume-job match score

### Users

- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `GET /api/users/credits` - Get credit balance

### Jobs

- `GET /api/jobs` - Get saved job descriptions
- `POST /api/jobs` - Save new job description
- `DELETE /api/jobs/:id` - Delete job description

### Subscriptions

- `POST /api/subscriptions/checkout` - Create checkout session
- `POST /api/subscriptions/webhook` - Stripe webhook handler

### Analytics

- `GET /api/analytics/dashboard` - Get user analytics
- `POST /api/analytics/track` - Track user events

## Environment Variables

| Variable                | Description                               | Required | Default                 |
| ----------------------- | ----------------------------------------- | -------- | ----------------------- |
| `NODE_ENV`              | Environment (development/production/test) | No       | `development`           |
| `PORT`                  | Server port                               | No       | `4000`                  |
| `HOST`                  | Server host                               | No       | `0.0.0.0`               |
| `FRONTEND_URL`          | Frontend URL for CORS                     | No       | `http://localhost:3000` |
| `MONGODB_URI`           | MongoDB connection string                 | Yes      | -                       |
| `REDIS_URL`             | Redis connection URL                      | No       | -                       |
| `CLERK_SECRET_KEY`      | Clerk secret key                          | Yes      | -                       |
| `CLERK_WEBHOOK_SECRET`  | Clerk webhook secret                      | Yes      | -                       |
| `OPENAI_API_KEY`        | OpenAI API key                            | Yes      | -                       |
| `SMTP_HOST`             | SMTP server host                          | No       | -                       |
| `SMTP_PORT`             | SMTP server port                          | No       | `587`                   |
| `SMTP_USER`             | SMTP username                             | No       | -                       |
| `SMTP_PASS`             | SMTP password                             | No       | -                       |
| `EMAIL_FROM`            | Sender email address                      | No       | -                       |
| `FILE_STORAGE_TYPE`     | Storage type (local/s3)                   | No       | `local`                 |
| `UPLOAD_DIR`            | Local upload directory                    | No       | `uploads`               |
| `AWS_REGION`            | AWS region for S3                         | No\*     | -                       |
| `AWS_ACCESS_KEY_ID`     | AWS access key                            | No\*     | -                       |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key                            | No\*     | -                       |
| `AWS_S3_BUCKET`         | S3 bucket name                            | No\*     | -                       |
| `LOG_DIR`               | Log files directory                       | No       | `logs`                  |
| `LOG_LEVEL`             | Logging level                             | No       | `info`                  |

\* Required when `FILE_STORAGE_TYPE=s3`

## File Storage

The API supports two storage backends:

### Local Storage (Development)

```env
FILE_STORAGE_TYPE=local
UPLOAD_DIR=uploads
```

### AWS S3 (Production)

```env
FILE_STORAGE_TYPE=s3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=your_bucket
```

**Note**: S3 integration requires installing `@aws-sdk/client-s3`:

```bash
pnpm add @aws-sdk/client-s3 --filter @visume/api
```

## Development

### Code Style

- **Linting**: ESLint with TypeScript rules
- **Formatting**: Prettier (run `pnpm format` from root)

```bash
# Lint code
pnpm lint

# Format all code (from root)
pnpm format
```

### Testing

```bash
# Run all tests
pnpm test

# Watch mode for TDD
pnpm test:watch

# Generate coverage report
pnpm test -- --coverage
```

### Architecture

The API follows a layered architecture:

1. **Routes** (`src/routes/`) - Define API endpoints
2. **Controllers** (`src/controllers/`) - Handle HTTP requests/responses
3. **Services** (`src/services/`) - Business logic and external integrations
4. **Middleware** (`src/middleware/`) - Request processing pipeline
5. **Utils** (`src/utils/`) - Helper functions and utilities

### Adding New Features

1. Define route in `src/routes/`
2. Create controller in `src/controllers/`
3. Add business logic to `src/services/` if needed
4. Update types in shared packages if required
5. Write tests

## Deployment

### Docker

```bash
# Build image
docker build -t visume-api .

# Run container
docker run -p 4000:4000 --env-file .env.production visume-api
```

### Environment-Specific Deployment

The server automatically loads the correct `.env` file based on `NODE_ENV`:

- `NODE_ENV=development` → `.env.development`
- `NODE_ENV=production` → `.env.production`
- `NODE_ENV=test` → `.env.test`

## Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running: `mongod` or check Atlas connection
- Verify connection string format
- Check network/firewall settings

### Redis Connection Issues

- Check if Redis is running: `redis-cli ping`
- Verify REDIS_URL format
- Redis is optional; API will log warnings but continue

### Clerk Authentication Issues

- Verify CLERK_SECRET_KEY is for correct environment (test/live)
- Check webhook secret matches Clerk dashboard
- Ensure frontend uses matching Clerk publishable key

### OpenAI API Issues

- Verify API key is valid and has credits
- Check rate limits on your OpenAI account
- Review OpenAI API status page

## License

Proprietary - Visume AI Platform

## Support

For issues and questions, contact the development team or create an issue in the repository.
