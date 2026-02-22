// // api/hooks.js
// import { useState, useEffect, useCallback } from "react";

// export const useFetch = (apiFn) => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchData = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const result = await apiFn();
//       setData(result);
//     } catch (err) {
//       setError(err?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   }, [apiFn]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   return {
//     data,
//     loading,
//     error,
//     refetch: fetchData,
//   };
// };