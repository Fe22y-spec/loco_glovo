import React from "react";

export function CardSkeleton() {
  return (
    <div className="rounded-xl2 overflow-hidden glass shadow-card p-4">
      <div className="skeleton h-36 rounded-xl mb-4" />
      <div className="skeleton h-4 rounded w-3/4 mb-2" />
      <div className="skeleton h-4 rounded w-1/2 mb-4" />
      <div className="skeleton h-9 rounded-full w-full" />
    </div>
  );
}
