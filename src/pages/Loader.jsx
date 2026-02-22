import React from "react";

function Loader() {
  return (
    <>
      <style>
        {`
          .loader-wrapper {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: #f8f5f2;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            animation: fadeIn 0.3s ease-in-out;
          }

          .loader-spinner {
            width: 3rem;
            height: 3rem;
            border-width: 4px;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>

      <div className="loader-wrapper">
        <div className="text-center">
          <div
            className="spinner-border text-primary loader-spinner"
            role="status"
          ></div>
          <h5 className="mt-3 fw-bold text-primary">
            Brewing Your Experience...
          </h5>
        </div>
      </div>
    </>
  );
}

export default Loader;