import "./Data-Table.css";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./redux-hooks";
import {
  areReadingsLoading,
  isReadingError,
  loadReadings,
  readingData,
} from "./redux";

export function DataTable() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const d = dispatch(loadReadings());
    return () => d.abort();
  }, [dispatch]);

  const loading = useAppSelector(areReadingsLoading);
  const error = useAppSelector(isReadingError);
  const readings = useAppSelector(readingData);

  if (loading) {
    return "LOADING...";
  }
  if (error) {
    return "ERROR!";
  }

  return null;
}
