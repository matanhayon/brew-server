import {
  addBrewery,
  fetchBreweries,
  fetchBreweryById,
  fetchAllBreweriesByUserId,
  insertJoinRequest,
  fetchPendingJoinRequests,
  approveJoinRequest,
  deleteJoinRequest,
  updateMemberRoleById,
  deleteMemberById,
  fetchApprovedBreweriesByUserId,
  fetchPendingBreweriesByUserId,
} from "../services/breweriesService.js";

export async function createBrewery(req, res) {
  const breweryData = req.body;
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");

  try {
    const savedBrewery = await addBrewery(breweryData, token);
    res.status(201).json(savedBrewery);
  } catch (err) {
    console.error("Error creating brewery:", err.message);
    res.status(500).json({ error: "Failed to create brewery" });
  }
}

export async function getAllBreweries(_req, res) {
  try {
    const breweries = await fetchBreweries();
    res.json(breweries);
  } catch (err) {
    console.error("Error fetching breweries:", err.message);
    res.status(500).json({ error: "Failed to fetch breweries" });
  }
}

export async function getBreweryById(req, res) {
  const { id } = req.params;
  try {
    const brewery = await fetchBreweryById(id);
    if (!brewery) {
      return res.status(404).json({ error: "Brewery not found" });
    }
    res.json(brewery);
  } catch (err) {
    console.error("Error fetching brewery:", err.message);
    res.status(500).json({ error: "Failed to fetch brewery" });
  }
}

export async function getAllBreweriesByUserId(req, res) {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: "Missing user_id in query" });
  }

  try {
    const breweries = await fetchAllBreweriesByUserId(user_id);
    res.json(breweries);
  } catch (err) {
    console.error("Error fetching user breweries:", err.message);
    res.status(500).json({ error: "Failed to fetch user breweries" });
  }
}

export async function requestJoinBrewery(req, res) {
  const { brewery_id, message, status } = req.body;

  if (!brewery_id) {
    return res.status(400).json({ error: "Missing brewery_id" });
  }

  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");

  try {
    const joinRequest = await insertJoinRequest(
      { brewery_id, message, status },
      token
    );

    res.status(201).json(joinRequest);
  } catch (err) {
    console.error("Error inserting join request:", err.message);
    res.status(500).json({ error: "Failed to send join request" });
  }
}

export async function getPendingJoinRequests(req, res) {
  const { brewery_id } = req.query;
  if (!brewery_id) {
    return res.status(400).json({ error: "Missing brewery_id" });
  }

  try {
    const requests = await fetchPendingJoinRequests(brewery_id);
    res.json(requests);
  } catch (err) {
    console.error("Error fetching pending join requests:", err.message);
    res.status(500).json({ error: "Failed to fetch join requests" });
  }
}

export async function approveJoinRequestById(req, res) {
  const { id } = req.params;

  try {
    await approveJoinRequest(id);
    res.json({ message: "Join request approved" });
  } catch (err) {
    console.error("Error approving request:", err.message);
    res.status(500).json({ error: "Failed to approve request" });
  }
}

export async function deleteJoinRequestById(req, res) {
  const { id } = req.params;

  try {
    await deleteJoinRequest(id);
    res.status(204).send(); // No content
  } catch (err) {
    console.error("Error deleting request:", err.message);
    res.status(500).json({ error: "Failed to delete request" });
  }
}

export async function updateMemberRole(req, res) {
  const { id } = req.params;
  const { role } = req.body;

  if (!["admin", "brewer", "viewer"].includes(role)) {
    return res.status(400).json({ error: "Invalid role value" });
  }

  try {
    await updateMemberRoleById(id, role);
    res.json({ message: "Role updated" });
  } catch (error) {
    console.error("Error updating role:", error.message);
    res.status(500).json({ error: "Failed to update role" });
  }
}

export async function deleteMember(req, res) {
  const { id } = req.params;

  try {
    await deleteMemberById(id);
    res.status(204).send(); // No content
  } catch (error) {
    console.error("Error removing member:", error.message);
    res.status(500).json({ error: "Failed to remove member" });
  }
}

export async function getApprovedBreweriesByUserId(req, res) {
  const { user_id } = req.query;
  if (!user_id) {
    return res.status(400).json({ error: "Missing user_id in query" });
  }

  try {
    const breweries = await fetchApprovedBreweriesByUserId(user_id);
    res.json(breweries);
  } catch (err) {
    console.error("Error fetching approved breweries:", err.message);
    res.status(500).json({ error: "Failed to fetch approved breweries" });
  }
}

export async function getPendingBreweriesByUserId(req, res) {
  const { user_id } = req.query;
  if (!user_id) {
    return res.status(400).json({ error: "Missing user_id in query" });
  }

  try {
    const breweries = await fetchPendingBreweriesByUserId(user_id);
    res.json(breweries);
  } catch (err) {
    console.error("Error fetching pending breweries:", err.message);
    res.status(500).json({ error: "Failed to fetch pending breweries" });
  }
}
