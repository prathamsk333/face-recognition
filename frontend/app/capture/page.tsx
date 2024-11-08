"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function MainPage() {
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startWebcam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsWebcamActive(true);
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
      setMessage("Error accessing webcam. Please check your permissions.");
    }
  }, []);

  const stopWebcam = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      setIsWebcamActive(false);
    }
  }, []);

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        const imageDataUrl = canvasRef.current.toDataURL("image/jpeg");
        return imageDataUrl;
      }
    }
    return null;
  }, []);

  const sendImageToServer = useCallback(async (imageDataUrl: string) => {
    setIsLoading(true);
    try {
      const byteString = atob(imageDataUrl.split(",")[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ua = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ua[i] = byteString.charCodeAt(i);
      }
      const file = new Blob([ab], { type: "image/jpeg" });

      const formData = new FormData();
      formData.append("file", file, "image.jpg");

      const response = await axios.post(
        "http://127.0.0.1:8000/match-face/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.status === "success") {
        setMessage("Attendance recorded successfully!");
        console.log("success");
        console.log(response);
      } else if (response.data.status === "info") {
        setMessage("Attendance has already been successfully recorded.");
      } else {
        setMessage("Face not recognized. Please try again.");
        console.log("failure");
      }
    } catch (error) {
      console.error("Error sending image to server:", error);
      setMessage("Error processing image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCapture = useCallback(() => {
    const imageDataUrl = captureImage();
    if (imageDataUrl) {
      sendImageToServer(imageDataUrl);
    } else {
      setMessage("Failed to capture image. Please try again.");
    }
  }, [captureImage, sendImageToServer]);

  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, [stopWebcam]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center">
        <Link href="../">
          <button className=" rounded-xl bg-green-600 text-white w-[6.5rem] h-[2.5rem]">
            Back
          </button>
        </Link>

      </div>
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-green-500 font-semibold mb-1">
              Face Recognition Attendance
            </div>
            <h1 className="block mt-1 text-lg leading-tight font-medium text-black">
              Capture Your Attendance
            </h1>
            <p className="mt-2 text-gray-500">
              Use the webcam to record your attendance quickly and securely.
            </p>

            <div className="mt-4">
              {!isWebcamActive ? (
                <button
                  onClick={startWebcam}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Start Webcam
                </button>
              ) : (
                <button
                  onClick={stopWebcam}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Stop Webcam
                </button>
              )}
            </div>

            <div className="mt-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-auto"
                style={{ display: isWebcamActive ? "block" : "none" }}
              />
              <canvas
                ref={canvasRef}
                style={{ display: "none" }}
                width="640"
                height="480"
              />
            </div>

            {isWebcamActive && (
              <button
                onClick={handleCapture}
                disabled={isLoading}
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />
                    Processing...
                  </>
                ) : (
                  "Capture and Send"
                )}
              </button>
            )}

            {message && (
              <div
                className={`mt-4 p-2 rounded ${
                  message.includes("successfully")
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
