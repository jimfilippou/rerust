export type Result<T, E = string> =
  | { success: true; value: T }
  | { success: false; value: E };

export const ok = <T>(value: T): Result<T> => ({
  success: true,
  value,
});

export const err = <E extends string>(value: E): Result<never, E> => ({
  success: false,
  value,
});

export const isOk = <T, E>(
  result: Result<T, E>
): result is { success: true; value: T } => result.success;

export const isErr = <T, E>(
  result: Result<T, E>
): result is { success: false; value: E } => !result.success;
