
const express = require("express");
const cors = require("cors");
const { XMLParser } = require("fast-xml-parser");

const app = express();
const PORT = 5000;

const FEED_URL =
  "https://sachet.ndma.gov.in/cap_public_website/rss/rss_india.xml";

app.use(cors());
app.use(express.json());

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  isArray: (name) => name === "item"
});

let cachedAlerts = null;
let lastFetched = null;

function getText(value) {
  if (value === undefined || value === null) return "";

  if (typeof value === "object") {
    return String(value["#text"] || "");
  }

  return String(value);
}

function cleanDescription(value) {
  return getText(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Find matching XML elements anywhere in the CAP document.
function findValues(obj, targetNames, results = []) {
  if (!obj || typeof obj !== "object") return results;

  for (const [key, value] of Object.entries(obj)) {
    const cleanKey = key.toLowerCase().split(":").pop();

    if (targetNames.includes(cleanKey)) {
      results.push(value);
    }

    if (typeof value === "object") {
      findValues(value, targetNames, results);
    }
  }

  return results;
}

// Convert a CAP polygon into an approximate centre point.
function polygonCenter(value) {
  const text = getText(value);

  const numbers = text.match(/-?\d+(?:\.\d+)?/g);

  if (!numbers || numbers.length < 4) return null;

  const points = [];

  for (let i = 0; i + 1 < numbers.length; i += 2) {
    const lat = Number(numbers[i]);
    const lng = Number(numbers[i + 1]);

    if (
      Number.isFinite(lat) &&
      Number.isFinite(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    ) {
      points.push({ lat, lng });
    }
  }

  if (points.length < 2) return null;

  const latitude =
    points.reduce((sum, point) => sum + point.lat, 0) /
    points.length;

  const longitude =
    points.reduce((sum, point) => sum + point.lng, 0) /
    points.length;

  return { latitude, longitude };
}

// CAP circle format: latitude,longitude radius
function circleCenter(value) {
  const text = getText(value);
  const numbers = text.match(/-?\d+(?:\.\d+)?/g);

  if (!numbers || numbers.length < 2) return null;

  const latitude = Number(numbers[0]);
  const longitude = Number(numbers[1]);

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return null;
  }

  return { latitude, longitude };
}

// Extract location and coordinates from the CAP alert.
function extractCapDetails(capData) {
  const areaNames = findValues(capData, ["areadesc"])
    .map(getText)
    .filter(Boolean);

  const polygons = findValues(capData, ["polygon"]);
  const circles = findValues(capData, ["circle"]);

  let coordinates = null;

  for (const polygon of polygons) {
    coordinates = polygonCenter(polygon);
    if (coordinates) break;
  }

  if (!coordinates) {
    for (const circle of circles) {
      coordinates = circleCenter(circle);
      if (coordinates) break;
    }
  }

  return {
    location: [...new Set(areaNames)].join(", ") || "Location not provided",
    latitude: coordinates?.latitude ?? null,
    longitude: coordinates?.longitude ?? null
  };
}

// Fetch the detailed CAP document linked by an RSS item.
async function fetchCapDetails(link) {
  try {
    if (!link) return null;

    const url = new URL(link);

    // Only fetch links from the official SACHET domain.
    if (url.hostname !== "sachet.ndma.gov.in") {
      return null;
    }

    const response = await fetch(url.toString(), {
      signal: AbortSignal.timeout(10000),
      headers: {
        "User-Agent": "Disaster360/1.0"
      }
    });

    if (!response.ok) return null;

    const xml = await response.text();
    const capData = parser.parse(xml);

    return extractCapDetails(capData);

  } catch (error) {
    console.log("CAP detail unavailable:", error.message);
    return null;
  }
}

app.get("/", (req, res) => {
  res.send("Disaster360 Live Alert Backend is running!");
});

app.get("/api/alerts", async (req, res) => {
  try {
    // Two-minute cache
    if (
      cachedAlerts !== null &&
      lastFetched &&
      Date.now() - lastFetched < 120000
    ) {
      return res.json({
        success: true,
        source: "NDMA SACHET",
        cached: true,
        lastUpdated: new Date(lastFetched).toISOString(),
        total: cachedAlerts.length,
        alertsWithCoordinates: cachedAlerts.filter(
          alert => alert.latitude !== null
        ).length,
        alerts: cachedAlerts
      });
    }

    console.log("Fetching NDMA RSS feed...");

    const response = await fetch(FEED_URL, {
      signal: AbortSignal.timeout(15000),
      headers: {
        "User-Agent": "Disaster360/1.0"
      }
    });

    if (!response.ok) {
      throw new Error(`NDMA returned HTTP ${response.status}`);
    }

    const xmlData = await response.text();
    const parsedData = parser.parse(xmlData);

    const rawItems = parsedData?.rss?.channel?.item || [];
    const items = Array.isArray(rawItems)
      ? rawItems
      : [rawItems];

    const alerts = [];

    // Fetch detailed CAP documents in small batches.
    for (let i = 0; i < items.length; i += 5) {
      const batch = items.slice(i, i + 5);

      const batchAlerts = await Promise.all(
        batch.map(async (item, index) => {
          const link = getText(item.link);

          const capDetails = await fetchCapDetails(link);

          return {
            id: getText(item.guid) || `ndma-${i + index}`,
            title: getText(item.title),
            description: cleanDescription(item.description),
            publishedAt: getText(item.pubDate),
            link,
            source: "NDMA SACHET",

            location:
              capDetails?.location || "Location not provided",

            latitude: capDetails?.latitude ?? null,
            longitude: capDetails?.longitude ?? null
          };
        })
      );

      alerts.push(...batchAlerts);
    }

    cachedAlerts = alerts;
    lastFetched = Date.now();

    const coordinateCount = alerts.filter(
      alert =>
        alert.latitude !== null &&
        alert.longitude !== null
    ).length;

    console.log(`Received ${alerts.length} official alerts.`);
    console.log(`${coordinateCount} alerts have coordinates.`);

    res.json({
      success: true,
      source: "NDMA SACHET",
      cached: false,
      lastUpdated: new Date(lastFetched).toISOString(),
      total: alerts.length,
      alertsWithCoordinates: coordinateCount,
      alerts
    });

  } catch (error) {
    console.error("Live alert error:", error.message);

    res.status(502).json({
      success: false,
      source: "NDMA SACHET",
      message: "Unable to retrieve official alerts.",
      error: error.message,
      lastUpdated: lastFetched
        ? new Date(lastFetched).toISOString()
        : null,
      alerts: cachedAlerts || []
    });
  }
});

app.listen(PORT, () => {
  console.log("--------------------------------");
  console.log("Disaster360 Backend Started");
  console.log(`Server: http://localhost:${PORT}`);
  console.log(`Alerts: http://localhost:${PORT}/api/alerts`);
  console.log("--------------------------------");
});
