"use client";

import { catchError, type ErrorInfo } from "next/error";
import { useEffect } from "react";
import { reportClientError } from "@/lib/report-client-error";

function OptionalFeatureFallback(
  { feature }: { feature: string },
  { error }: ErrorInfo,
) {
  useEffect(() => reportClientError(error, feature), [error, feature]);
  return null;
}

/** Decorative effects and optional telemetry can fail without replacing the page. */
export const OptionalFeatureBoundary = catchError(OptionalFeatureFallback);
