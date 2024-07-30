import Fastify from 'fastify'
import process from 'node:process';
import { z } from 'zod';

const fastify = Fastify({
    logger: true
  })

const SENSOR_BASE_READINGS: Record<string, number> = {
    '1': 100,
    '2': 110,
    '3': 120
}

const SENSOR_MAX = 400;
const SENSOR_MIN = 50;
const SENSOR_STEP_MAX = 10;

fastify.get('/sensors', async () => {
    return { sensorIds: Object.keys(SENSOR_BASE_READINGS) }
});

const queryParmeters = z.object({
    sensorId: z.string(),
    from: z.string().datetime({ offset: true }).optional(),
    to: z.string().datetime({ offset: true }).optional()
})

fastify.get('/readings', async (request, reply) => {
    const result = queryParmeters.safeParse(request.query);
    if (!result.success) {
        reply.status(400).send({ error: result.error });
        return;
    }
    if (!(result.data.sensorId in SENSOR_BASE_READINGS)) {
        reply.status(404).send({ error: 'invalid sensorId'})
        return;
    }
    let startDate: Date;
    let endDate: Date;
    if (result.data.from !== undefined && result.data.to === undefined) {
        startDate = new Date(result.data.from);
        endDate = new Date(startDate.getTime() + 86_400_000);
    } else if (result.data.from === undefined && result.data.to !== undefined) {
        endDate = new Date(result.data.to);
        startDate = new Date(endDate.getTime() - 86_400_000); 
    } else if (result.data.from !== undefined && result.data.to !== undefined) {
        startDate = new Date(result.data.from);
        endDate = new Date(result.data.to);
    } else {
        endDate = new Date();
        startDate = new Date(endDate.getTime() - 86_400_000);
    }
    const readings = [];
    let temperature = SENSOR_BASE_READINGS[result.data.sensorId as keyof typeof SENSOR_BASE_READINGS]!;
    for(let timestamp = startDate.getTime(); timestamp <= endDate.getTime(); timestamp += 3_600_000) {
        const step = (Math.random() * SENSOR_STEP_MAX * 2) - SENSOR_STEP_MAX;
        temperature = Math.round(Math.max(Math.min(temperature + step, SENSOR_MAX), SENSOR_MIN));
        readings.push({ timestamp: new Date(timestamp).toISOString(), temperature });
    }
    return { readings };
  })

  const sensorScanRegEx = /(?<sensorId>[a-f1-9]{1,3})-[^-]+-(?<baseTemp>1\d\d)/;

  const sensorScan = z.object({
    sensor: z.string().regex(sensorScanRegEx)
  })

  fastify.post('/add-sensor', async (request, reply) => {
    const result = sensorScan.safeParse(request.body);
    if (!result.success) {
        reply.code(400).send({ error: result.error });
        return;
    }
    const { groups: { sensorId, baseTemp } = {}} = sensorScanRegEx.exec(result.data.sensor)!;
    const temp = Number(baseTemp);
    if (!Number.isNaN(temp)) {
        SENSOR_BASE_READINGS[sensorId] = temp
    }
    return { sensorIds: Object.keys(SENSOR_BASE_READINGS) }
  })
  
  // Run the server!
  try {
    await fastify.listen({ port: 3001 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }