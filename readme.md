# ReRust 🦀

[![npm version](https://img.shields.io/npm/v/rerust.svg)](https://www.npmjs.com/package/rerust)
[![JSR](https://jsr.io/badges/@jimfilippou/rerust)](https://jsr.io/@jimfilippou/rerust)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/rerust)](https://bundlephobia.com/package/rerust)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![No Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)](package.json)

Zero-dependency, type-safe error handling inspired by Rust's Result type. Say goodbye to try-catch blocks and hello to elegant error handling!

## Features

- 🚀 **Zero Dependencies** - Lightweight and blazing fast
- 💪 **Type Safe** - Full TypeScript support with type inference
- 🌐 **Universal** - Works in Node.js, Bun, Deno, and browsers
- 🎯 **Tree Shakeable** - Only import what you need
- 📦 **Tiny** - Less than 300 bytes minified + gzipped

## Installation

```bash
# npm
npm install rerust

# yarn
yarn add rerust

# pnpm
pnpm add rerust

# JSR registry
npx jsr add @jimfilippou/rerust
```

## Sponsors

## Why ReRust?

Traditional error handling in JavaScript/TypeScript often leads to verbose and nested try-catch blocks. ReRust provides a more elegant way to handle errors, inspired by Rust's Result type.

### Before ReRust

```typescript
async function getUserData(userId: string) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }
    const data = await response.json();
    try {
      validateUserData(data);
      return data;
    } catch (validationError) {
      console.error("Validation failed:", validationError);
      throw validationError;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

// Usage
async function handleUserProfile() {
  try {
    const userData = await getUserData("123");
    if (userData === null) {
      showError("Failed to load user");
      return;
    }
    updateUI(userData);
  } catch (error) {
    showError("Something went wrong");
  }
}
```

### After ReRust

```typescript
import { ok, err, isOk, isErr, type Result } from "rerust";

async function getUserData(userId: string): Promise<Result<UserData>> {
  const response = await fetch(`/api/users/${userId}`)
    .then((res) => (res.ok ? ok(res) : err("Failed to fetch user")))
    .catch(() => err("Network error"));

  if (isErr(response)) return response;

  const data = await response.value.json();
  const validationResult = validateUserData(data);

  return isOk(validationResult) ? ok(data) : err("Invalid user data");
}

// Usage
async function handleUserProfile() {
  const res = await getUserData("123");
  if (isErr(res)) return showError(result.value); // Type-safe error message
  updateUI(result.value);
}
```

## Advanced Usage

### Chaining Results

```typescript
import { ok, err, isOk, type Result } from "rerust";

type User = { id: string; name: string };
type Order = { id: string; items: string[] };

function findUser(id: string): Result<User> {
  // Simulate database lookup
  return id === "1" ? ok({ id: "1", name: "John" }) : err("User not found");
}

function getUserOrders(user: User): Result<Order[]> {
  // Simulate order lookup
  return ok([{ id: "order1", items: ["item1", "item2"] }]);
}

// Chain operations
function getUserWithOrders(
  userId: string
): Result<{ user: User; orders: Order[] }> {
  const userResult = findUser(userId);
  if (isErr(userResult)) return userResult;

  const ordersResult = getUserOrders(userResult.value);
  if (isErr(ordersResult)) return ordersResult;

  return ok({
    user: userResult.value,
    orders: ordersResult.value,
  });
}
```

### Type Guards

```typescript
const result = ok({ name: "John", age: 30 });

// TypeScript knows `user` has `name` and `age` properties
if (isOk(result)) {
  const user = result.value;
  console.log(user.name); // TypeScript autocompletion works!
}

// TypeScript knows `error` is a string
if (isErr(result)) {
  const error = result.value;
  console.error(error.toUpperCase()); // TypeScript knows this is a string
}
```

## API Reference

### Types

```typescript
type Result<T, E = string> =
  | { success: true; value: T } // Ok variant
  | { success: false; value: E }; // Err variant
```

### Functions

- `ok<T>(value: T): Result<T>` - Creates a successful result
- `err<E>(value: E): Result<never, E>` - Creates an error result
- `isOk<T, E>(result: Result<T, E>): boolean` - Type guard for successful results
- `isErr<T, E>(result: Result<T, E>): boolean` - Type guard for error results

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
