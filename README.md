# Financial Management API

A NestJS implementation of a Financial Management API using MongoDB.

## Description

This API provides functionality for managing financial records and tags for organizations. It allows you to:

- Create and list tags
- Create and list financial records
- Generate cash flow reports

## Installation

```bash
# Install dependencies
pnpm install

# Start MongoDB locally (requires Docker)
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Set environment variables
export MONGODB_URI="mongodb://localhost:27017/financial_db"
export PORT=3000
```

## Running the app

```bash
# Development
pnpm run start:dev

# Production mode
pnpm run build
pnpm run start:prod
```

## API Endpoints

### Tags

- **Create a tag**
  - `POST /api/organizations/:organizationId/tags`
  - Body: `{ "name": "string" }`

- **List tags**
  - `GET /api/organizations/:organizationId/tags?page=1&page_size=20`

### Financial Records

- **Create a financial record**
  - `POST /api/organizations/:organizationId/financial-records`
  - Body: `{ "direction": "IN"|"OUT", "amount": number, "dueDate": "2023-01-01T00:00:00Z", "tags": ["tagId1", "tagId2"] }`

- **Create multiple financial records**
  - `POST /api/organizations/:organizationId/financial-records/bulk`
  - Body: `{ "records": [{ "direction": "IN"|"OUT", "amount": number, "dueDate": "2023-01-01T00:00:00Z", "tags": ["tagId1", "tagId2"] }] }`

- **List financial records**
  - `GET /api/organizations/:organizationId/financial-records?page=1&page_size=20&tags=tagId1,tagId2`

- **Get cash flow report**
  - `GET /api/organizations/:organizationId/financial-records/reports/cash-flow`

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
