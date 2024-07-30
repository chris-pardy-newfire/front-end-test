import Fastify from "fastify";
import process from "node:process";
import { z } from "zod";

const fastify = Fastify({
  logger: true,
});

const SENSOR_BASE_READINGS: Record<string, number> = {
  "1": 100,
  "2": 110,
  "3": 120,
};

const SENSOR_MAX = 400;
const SENSOR_MIN = 50;
const SENSOR_STEP_MAX = 10;
const MAX_READINGS_PER_PAGE = 100;

const SLOW_DOWN = Number(process.env.SERVER_DELAY ?? 300);

const delay = () => new Promise((resolve) => setTimeout(resolve, SLOW_DOWN));

fastify.get("/sensors", async () => {
  await delay();
  return { sensorIds: Object.keys(SENSOR_BASE_READINGS) };
});

const queryParmeters = z.object({
  sensorId: z.string().optional(),
  from: z.string().datetime({ offset: true }).optional(),
  to: z.string().datetime({ offset: true }).optional(),
  page: z.number({ coerce: true }).optional(),
});

fastify.get("/readings", async (request, reply) => {
  const result = queryParmeters.safeParse(request.query);
  if (!result.success) {
    reply.status(400).send({ error: result.error });
    return;
  }
  if (result.data.sensorId && !(result.data.sensorId in SENSOR_BASE_READINGS)) {
    reply.status(404).send({ error: "invalid sensorId" });
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

  const readingsBySensor = new Map<
    string,
    { sensorId: string; timestamp: number; temperature: number }[]
  >();
  if (result.data.sensorId) {
    readingsBySensor.set(result.data.sensorId, []);
  } else {
    for (const sensorId of Object.keys(SENSOR_BASE_READINGS)) {
      readingsBySensor.set(sensorId, []);
    }
  }
  for (const [sensorId, sensorReadings] of readingsBySensor.entries()) {
    let temperature =
      SENSOR_BASE_READINGS[sensorId as keyof typeof SENSOR_BASE_READINGS];
    for (
      let timestamp = startDate.getTime();
      timestamp <= endDate.getTime();
      timestamp += 3_600_000
    ) {
      const step = Math.random() * SENSOR_STEP_MAX * 2 - SENSOR_STEP_MAX;
      temperature = Math.round(
        Math.max(Math.min(temperature + step, SENSOR_MAX), SENSOR_MIN),
      );
      sensorReadings.push({ sensorId, timestamp, temperature });
    }
  }

  const page = result.data.page ?? 1;

  const readings = Array.from(readingsBySensor.values())
    .flat()
    .sort((e1, e2) => e1.timestamp - e2.timestamp)
    .map(({ sensorId, timestamp, temperature }) => ({
      sensorId,
      timestamp: new Date(timestamp).toISOString(),
      temperature,
    }))
    .slice((page - 1) * MAX_READINGS_PER_PAGE);

  await delay();

  return {
    readings: readings.slice(0, MAX_READINGS_PER_PAGE),
    nextPage: readings.length > MAX_READINGS_PER_PAGE ? page + 1 : null,
  };
});

const newSensorPostBody = z.object({
  sensorId: z.string(),
});

fastify.post("/new-sensor", async (request, reply) => {
  const result = newSensorPostBody.safeParse(request.body);
  if (!result.success) {
    reply.status(400).send({ error: result.error });
    return;
  }
  const sensorRange = SENSOR_MAX - SENSOR_MIN;
  SENSOR_BASE_READINGS[result.data.sensorId] = Math.round(
    Math.random() * sensorRange + SENSOR_MIN,
  );
  await delay();
  return { sensorIds: Object.keys(SENSOR_BASE_READINGS) };
});

// Run the server!
try {
  await fastify.listen({ port: 3001 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
