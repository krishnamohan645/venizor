/** Error reporting must never become a second failure in recovery UI. */
export function reportClientError(error: unknown, scope: string) {
  void import("@sentry/nextjs")
    .then(({ captureException }) =>
      captureException(error, { tags: { recovery_scope: scope } }),
    )
    .catch(() => {
      /* Recovery remains available when monitoring cannot load. */
    });
}
