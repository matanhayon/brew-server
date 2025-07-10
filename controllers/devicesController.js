import {
  registerDevice,
  fetchDevicesByBrewery,
  updateDeviceStatus,
  deleteDevice,
} from "../services/devicesService.js";

export async function createDevice(req, res) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");

  const { name, brewery_id } = req.body;

  if (!name || !brewery_id) {
    return res.status(400).json({ error: "Missing name or brewery_id" });
  }

  try {
    const device = await registerDevice({ name, brewery_id }, token);
    res.status(201).json(device);
  } catch (err) {
    console.error("Device creation failed:", err.message);
    res.status(500).json({ error: "Failed to create device" });
  }
}

export async function getDevicesByBrewery(req, res) {
  const { brewery_id } = req.query;
  if (!brewery_id) return res.status(400).json({ error: "Missing brewery_id" });

  try {
    const devices = await fetchDevicesByBrewery(brewery_id);
    res.json(devices);
  } catch (err) {
    console.error("Fetch failed:", err.message);
    res.status(500).json({ error: "Failed to fetch devices" });
  }
}

export async function patchDeviceStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const device = await updateDeviceStatus(id, status);
    res.json(device);
  } catch (err) {
    console.error("Update failed:", err.message);
    res.status(500).json({ error: "Failed to update device" });
  }
}

export async function removeDevice(req, res) {
  const { id } = req.params;

  try {
    await deleteDevice(id);
    res.status(204).send();
  } catch (err) {
    console.error("Delete failed:", err.message);
    res.status(500).json({ error: "Failed to delete device" });
  }
}
