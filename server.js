/**
 * REST API with Express
 * ---------------------
 * In-memory user resource with validation and consistent JSON responses.
 * Run with: node server.js (after npm install)
 */

const express = require("express");
const crypto = require("crypto");

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
const PORT = process.env.PORT || 3000;
const NAME_MIN_LENGTH = 1;
const NAME_MAX_LENGTH = 100;
const EMAIL_MAX_LENGTH = 254;
// Pragmatic email pattern (not a full RFC parser; good for typical APIs).
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// UUID v4 (matches crypto.randomUUID() output).
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// ---------------------------------------------------------------------------
// App & in-memory store
// ---------------------------------------------------------------------------
const app = express();

/** @type {{ id: string, name: string, email: string }[]} */
let users = [
  {
    id: crypto.randomUUID(),
    name: "Alice",
    email: "alice@example.com",
  },
  {
    id: crypto.randomUUID(),
    name: "Bob",
    email: "bob@example.com",
  },
];

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(express.json());

// ---------------------------------------------------------------------------
// Response helper (uniform envelope)
// ---------------------------------------------------------------------------
function jsonResponse(res, statusCode, message, data = null) {
  return res.status(statusCode).json({ message, data });
}

// ---------------------------------------------------------------------------
// Validation & domain helpers
// ---------------------------------------------------------------------------

function isUuid(value) {
  return typeof value === "string" && UUID_PATTERN.test(value);
}

/**
 * Validates name and email for create/update.
 * @param {{ name?: unknown, email?: unknown }} body
 * @param {{ currentId?: string }} options - exclude this id when checking email uniqueness (for PUT)
 * @returns {{ ok: true, name: string, email: string } | { ok: false, errors: string[], httpStatus?: number }}
 */
function validateUserBody(body, options = {}) {
  const errors = [];
  const { currentId } = options;

  const nameRaw = body?.name;
  const emailRaw = body?.email;

  if (nameRaw === undefined || nameRaw === null) {
    errors.push('Field "name" is required.');
  } else if (typeof nameRaw !== "string") {
    errors.push('Field "name" must be a string.');
  } else {
    const name = nameRaw.trim();
    if (name.length < NAME_MIN_LENGTH) {
      errors.push(`Field "name" must be at least ${NAME_MIN_LENGTH} character(s).`);
    } else if (name.length > NAME_MAX_LENGTH) {
      errors.push(`Field "name" must be at most ${NAME_MAX_LENGTH} characters.`);
    }
  }

  if (emailRaw === undefined || emailRaw === null) {
    errors.push('Field "email" is required.');
  } else if (typeof emailRaw !== "string") {
    errors.push('Field "email" must be a string.');
  } else {
    const email = emailRaw.trim().toLowerCase();
    if (email.length === 0) {
      errors.push('Field "email" cannot be empty.');
    } else if (email.length > EMAIL_MAX_LENGTH) {
      errors.push(`Field "email" must be at most ${EMAIL_MAX_LENGTH} characters.`);
    } else if (!EMAIL_PATTERN.test(email)) {
      errors.push('Field "email" must be a valid email address.');
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const name = String(nameRaw).trim();
  const email = String(emailRaw).trim().toLowerCase();

  const duplicate = users.some(
    (u) => u.email === email && u.id !== currentId
  );
  if (duplicate) {
    return {
      ok: false,
      errors: ["A user with this email already exists."],
      httpStatus: 409,
    };
  }

  return { ok: true, name, email };
}

function findUserIndexById(id) {
  return users.findIndex((u) => u.id === id);
}

// ---------------------------------------------------------------------------
// /users routes — collection (GET, POST) and member (PUT, DELETE) by UUID :id
// ---------------------------------------------------------------------------
const usersRouter = express.Router();

usersRouter.get("/", (req, res) => {
  return jsonResponse(res, 200, "Users retrieved successfully", users);
});

usersRouter.post("/", (req, res) => {
  const parsed = validateUserBody(req.body);
  if (!parsed.ok) {
    const status = parsed.httpStatus ?? 400;
    const message =
      status === 409 ? "Email already in use." : "Validation failed.";
    return jsonResponse(res, status, message, { errors: parsed.errors });
  }

  const newUser = {
    id: crypto.randomUUID(),
    name: parsed.name,
    email: parsed.email,
  };
  users.push(newUser);

  return jsonResponse(res, 201, "User created successfully.", newUser);
});

/**
 * Resolve :id for member routes — validates UUID and loads the user.
 */
usersRouter.param("id", (req, res, next, id) => {
  if (!isUuid(id)) {
    return jsonResponse(
      res,
      400,
      'Invalid user id. Use a UUID (e.g. from GET /users).',
      null
    );
  }
  const index = findUserIndexById(id);
  if (index === -1) {
    return jsonResponse(res, 404, "User not found.", null);
  }
  req.userIndex = index;
  req.user = users[index];
  next();
});

/**
 * PUT /users/:id — full replacement of name and email (REST PUT semantics).
 */
usersRouter.put("/:id", (req, res) => {
  const parsed = validateUserBody(req.body, { currentId: req.user.id });
  if (!parsed.ok) {
    const status = parsed.httpStatus ?? 400;
    const message =
      status === 409 ? "Email already in use." : "Validation failed.";
    return jsonResponse(res, status, message, { errors: parsed.errors });
  }

  const updated = {
    id: req.user.id,
    name: parsed.name,
    email: parsed.email,
  };
  users[req.userIndex] = updated;

  return jsonResponse(res, 200, "User updated successfully.", updated);
});

/**
 * DELETE /users/:id — remove user from the store.
 */
usersRouter.delete("/:id", (req, res) => {
  users.splice(req.userIndex, 1);
  return jsonResponse(res, 200, "User deleted successfully.", null);
});

app.use("/users", usersRouter);

// ---------------------------------------------------------------------------
// Root & fallthrough handlers
// ---------------------------------------------------------------------------
app.get("/", (req, res) => {
  return jsonResponse(res, 200, "API is working.", null);
});

app.use((req, res) => {
  return jsonResponse(res, 404, `Cannot ${req.method} ${req.path}.`, null);
});

app.use((err, req, res, next) => {
  console.error("Server error:", err);
  return jsonResponse(
    res,
    500,
    "Something went wrong on the server.",
    null
  );
});

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
