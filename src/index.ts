/**
 * Represents a Result type that handles success and error cases in a type-safe manner.
 * Inspired by Rust's Result type, this provides a way to handle errors without exceptions.
 *
 * @template T - The type of the success value
 * @template E - The type of the error value, defaults to string
 *
 * @example
 * ```typescript
 * // Success case with number
 * const success: Result<number> = { success: true, value: 42 };
 *
 * // Error case with custom error
 * const error: Result<User, 'NOT_FOUND'> = { success: false, value: 'NOT_FOUND' };
 * ```
 *
 * @remarks
 * The Result type is particularly useful when:
 * - You want to avoid try/catch blocks
 * - You need to handle errors in a functional way
 * - You want to make error handling explicit in your function signatures
 *
 * @see {@link ok} for creating success results
 * @see {@link err} for creating error results
 * @see {@link isOk} for type guarding success cases
 * @see {@link isErr} for type guarding error cases
 */
export type Result<T, E = string> =
  | { success: true; value: T }
  | { success: false; value: E };

/**
 * Creates a successful Result containing a value.
 *
 * @template T - The type of the success value
 * @param value - The success value to wrap
 * @returns A Result object representing success
 *
 * @example
 * ```typescript
 * // Basic usage
 * const result = ok(42);
 *
 * // With custom types
 * interface User { id: number; name: string }
 * const user: User = { id: 1, name: 'John' };
 * const userResult = ok(user);
 *
 * // With arrays
 * const arrayResult = ok([1, 2, 3]);
 * ```
 *
 * @remarks
 * Use this function when:
 * - An operation completed successfully
 * - You want to wrap a value in a Result type
 * - You're implementing a function that returns a Result
 *
 * @see {@link err} for creating error results
 * @see {@link isOk} for type guarding ok results
 */
export const ok = <T>(value: T): Result<T> => ({
  success: true,
  value,
});

/**
 * Creates an error Result containing an error message.
 *
 * @template E - The type of the error value (must extend string)
 * @param value - The error message or value
 * @returns A Result object representing failure
 *
 * @example
 * ```typescript
 * // Basic error
 * const error = err('File not found');
 *
 * // With literal types
 * type ApiError = 'NOT_FOUND' | 'UNAUTHORIZED' | 'SERVER_ERROR';
 * const apiError = err<ApiError>('NOT_FOUND');
 *
 * // In async functions
 * async function fetchUser(id: string): Promise<Result<User>> {
 *   if (!id) return err('Invalid ID');
 *   // ... fetch logic
 * }
 * ```
 *
 * @remarks
 * - The error value must be a string or a type that extends string
 * - Uses never as success type to ensure type safety
 * - Commonly used with union types for specific error cases
 *
 * @see {@link ok} for creating success results
 * @see {@link isErr} for type guarding error results
 */
export const err = <E extends string>(value: E): Result<never, E> => ({
  success: false,
  value,
});

/**
 * Type guard to check if a Result is a success case.
 * Narrows the type to access the success value safely.
 *
 * @template T - The type of the success value
 * @template E - The type of the error value
 * @param result - The Result to check
 * @returns Type predicate indicating if the Result is a success
 *
 * @example
 * ```typescript
 * const result = ok({ name: 'John', age: 30 });
 *
 * if (isOk(result)) {
 *   // TypeScript knows result.value is the success type
 *   console.log(result.value.name); // Safe access
 * }
 *
 * // Using with array methods
 * const results: Result<number>[] = [ok(1), err('failed'), ok(3)];
 * const successValues = results.filter(isOk).map(r => r.value);
 * ```
 *
 * @remarks
 * - Acts as a type guard in TypeScript
 * - Enables safe access to success values
 * - Can be used with higher-order functions
 *
 * @see {@link isErr} for checking error cases
 */
export const isOk = <T, E>(
  result: Result<T, E>
): result is { success: true; value: T } => result.success;

/**
 * Type guard to check if a Result is an error case.
 * Narrows the type to access the error value safely.
 *
 * @template T - The type of the success value
 * @template E - The type of the error value
 * @param result - The Result to check
 * @returns Type predicate indicating if the Result is an error
 *
 * @example
 * ```typescript
 * // Basic error checking
 * const result = err('invalid input');
 * if (isErr(result)) {
 *   console.error(result.value); // Typed as error type
 * }
 *
 * // Error handling in async functions
 * async function handleOperation() {
 *   const result = await performOperation();
 *   if (isErr(result)) {
 *     logError(result.value);
 *     return;
 *   }
 *   // TypeScript knows result.value is the success type here
 * }
 * ```
 *
 * @remarks
 * - Complements isOk for complete type coverage
 * - Particularly useful in error handling flows
 * - Enables pattern matching-like behavior
 *
 * @see {@link isOk} for checking success cases
 */
export const isErr = <T, E>(
  result: Result<T, E>
): result is { success: false; value: E } => !result.success;
