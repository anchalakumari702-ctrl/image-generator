import { Router } from 'express';
import { getDb } from '../db';

const router = Router();

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  database: {
    connected: boolean;
    responseTime: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  version: string;
}

/**
 * Health check endpoint
 * Returns application and database health status
 * Used by monitoring scripts and load balancers
 */
router.get('/health', async (req, res) => {
  const startTime = Date.now();
  const health: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      connected: false,
      responseTime: 0,
    },
    memory: {
      used: 0,
      total: 0,
      percentage: 0,
    },
    version: process.env.npm_package_version || '1.0.0',
  };

  // Check memory usage
  const memUsage = process.memoryUsage();
  health.memory.used = Math.round(memUsage.heapUsed / 1024 / 1024);
  health.memory.total = Math.round(memUsage.heapTotal / 1024 / 1024);
  health.memory.percentage = Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100);

  // Alert if memory usage is high
  if (health.memory.percentage > 90) {
    health.status = 'degraded';
  }

  // Check database connectivity
  try {
    const db = await getDb();
    if (db) {
      const dbStartTime = Date.now();
      
      // Simple query to test connection
      await db.execute('SELECT 1');
      
      health.database.responseTime = Date.now() - dbStartTime;
      health.database.connected = true;
    } else {
      health.status = 'degraded';
    }
  } catch (error) {
    health.status = 'unhealthy';
    health.database.connected = false;
  }

  // Determine HTTP status code
  const statusCode = 
    health.status === 'healthy' ? 200 :
    health.status === 'degraded' ? 503 :
    503;

  res.status(statusCode).json(health);
});

/**
 * Liveness probe endpoint
 * Simple endpoint for Kubernetes/Docker health checks
 * Returns 200 if application is running
 */
router.get('/health/live', (req, res) => {
  res.status(200).json({ status: 'alive' });
});

/**
 * Readiness probe endpoint
 * Returns 200 if application is ready to serve requests
 */
router.get('/health/ready', async (req, res) => {
  try {
    const db = await getDb();
    if (db) {
      await db.execute('SELECT 1');
      res.status(200).json({ status: 'ready' });
    } else {
      res.status(503).json({ status: 'not_ready', reason: 'database_unavailable' });
    }
  } catch (error) {
    res.status(503).json({ status: 'not_ready', reason: 'database_error' });
  }
});

export default router;
