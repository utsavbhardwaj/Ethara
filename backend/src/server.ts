import 'dotenv/config';
import app from './app';
import { config } from './config';
import prisma from './prisma/client';

async function bootstrap() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected');

    const server = app.listen(config.port, () => {
      console.log(`🚀 FlowSphere API running on port ${config.port}`);
      console.log(`📍 Environment: ${config.nodeEnv}`);
      console.log(`🔗 Health: http://localhost:${config.port}/health`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      console.log('SIGINT received. Shutting down gracefully...');
      server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

bootstrap();
