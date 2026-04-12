import { useEffect, useState } from "react";
import socket from "../services/Soket";

export default function OrderStatus({ orderId }) {
  const [status, setStatus] = useState("Accepted");

  useEffect(() => {

    socket.on("orderStatusUpdated", (data) => {
      if (data.id === orderId) {
        setStatus(data.status);
      }
    });

    return () => {
      socket.off("orderStatusUpdated");
    };

  }, [orderId]);

  return (
    <div>
      <h3>Order ID: {orderId}</h3>
      <h2>Status: {status}</h2>
    </div>
  );
}