"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import { twitchApi, youtubeApi, StreamData, PlatformStats } from "../services/api";

export default function Home() {
  const [theme, setTheme] = useState("light");
  const [buttonStyle, setButtonStyle] = useState("default");
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [recommendedStreams, setRecommendedStreams] = useState<StreamData[]>([]);
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(false); // Ensure semicolon is present
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");

    const savedPlatform = localStorage.getItem("selectedPlatform");
    if (savedPlatform) {
      setSelectedPlatform(savedPlatform);
      if (savedPlatform === "twitch") {
        fetchTwitchData();
      } else if (savedPlatform === "youtube") {
        fetchYouTubeData();
      }
    }
  }, []);



  const fetchYouTubeData = async () => {
    setLoading(true);
    try {
      const result = await youtubeApi.getTrendingVideos();
      
      if (result) {
        setRecommendedStreams(result.streams);
        setPlatformStats(result.stats);
      } else {
        console.error("Failed to fetch YouTube data");
      }
    } catch (error: any) {
      console.error("Error fetching YouTube data:", error);
      
      // Handle different types of API errors
      if (error.response?.status === 403) {
        // Check if the error is due to quota exceeded
        if (error.response?.data?.error?.errors?.some((e: any) => e.reason === "quotaExceeded")) {
          alert("YouTube API quota exceeded. Please try again later or contact the administrator.");
        } else {
          // Handle other 403 errors (invalid API key, disabled API, etc.)
          alert("YouTube API access forbidden. Your API key may be invalid or the YouTube Data API may not be enabled for your project.");
        }
      } else if (error.response?.status === 400) {
        alert("Bad request to YouTube API. Please check your API configuration.");
      } else {
        alert("Failed to fetch YouTube data. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchTwitchData = async () => {
    setLoading(true);
    try {
      const result = await twitchApi.getTopStreams();
      
      if (result) {
        setRecommendedStreams(result.streams);
        setPlatformStats(result.stats);
      } else {
        console.error("Failed to fetch Twitch data");
      }
    } catch (error) {
      console.error("Error fetching Twitch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlatformClick = (platform: string, platformUrl: string) => {
    setSelectedPlatform(platform);

    localStorage.setItem("selectedPlatform", platform);

    if (platform === "twitch") {
      fetchTwitchData();
    } else if (platform === "youtube") {
      fetchYouTubeData();
    }
  };



  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const changeButtonStyle = (style: string) => {
    setButtonStyle(style);
    document.documentElement.setAttribute("data-button-style", style);
  };

  const getButtonClasses = (baseClasses: string, style: string) => {
    const styleClasses = {
      default: 'rounded-xl',
      rounded: 'rounded-[2rem]',
    };
    return `${baseClasses} ${styleClasses[style as keyof typeof styleClasses]}`;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${theme === 'light' ? 'from-gray-50 to-gray-100' : 'from-gray-900 to-gray-800'} relative`}>
      {/* Modal for Shrek image */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-2 right-2 text-black">X</button>
            <Image
              src="/shrek.png"
              alt="Shrek"
              width={400}
              height={400}
              className="rounded-lg"
            />
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-12">
          <header className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-mono text-black">
              Escolhe a sua <span className="relative">
                <button
                  onClick={() => setIsModalOpen(true)} // Open modal on click
                  className="absolute inset-0 w-full h-full opacity-0"
                >
                  sua
                </button>
              </span>plataforma
            </h1>
          </header>

          <Image
            src="/aquele.png"
            alt="Featured Image"
            width={400}
            height={225}
            priority
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mx-auto place-items-center">
            <div className="w-full space-y-4">
              <button
                onClick={() => handlePlatformClick("twitch", "http://twitch.tv/")}
                className={`group relative overflow-hidden bg-gradient-to-r from-purple-600 to-purple-800 p-8 transition-all duration-300 ease-in-out hover:shadow-purple-500/20 hover:from-purple-500 hover:to-purple-700 w-full ${buttonStyle === 'rounded' ? 'rounded-[2rem]' : 'rounded-xl'}`}
                style={{ '--button-glow-color': '147, 51, 234' } as React.CSSProperties}
              >
                <div className="relative z-10 flex items-center space-x-4">
                  <div className="rounded-full bg-white/10 p-2 transition-transform duration-300 group-hover:scale-110">
                    <Image
                      src="/twitch.png"
                      alt="Twitch Logo"
                      width={32}
                      height={32}
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <span className="text-xl font-semibold text-white transition-all duration-300 group-hover:translate-x-1">Twitch </span>
                </div>

                <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 opacity-10 transition-opacity duration-300 group-hover:opacity-20">
                  <Image
                    src="/twitch.png"
                    alt=""
                    width={120}
                    height={120}
                    className="transition-transform duration-300 group-hover:rotate-12"
                  />
                </div>
              </button>

              <a
                href="https://www.twitch.tv"
                target="_blank"
                rel="noopener noreferrer"
                className={getButtonClasses(`group relative overflow-hidden bg-gradient-to-r from-purple-600/80 to-purple-800/80 p-4 transition-all duration-300 ease-in-out hover:shadow-purple-500/20 hover:from-purple-500/80 hover:to-purple-700/80 w-full flex items-center justify-center`, buttonStyle)}
              >
                <span className="text-lg font-semibold text-white">Go to Twitch </span>
              </a>
            </div>

            <div className="w-full space-y-4">
              <button
                onClick={() => handlePlatformClick("youtube", "https://www.youtube.com/")}
                className={getButtonClasses(`button-base group relative overflow-hidden rounded-xl bg-gradient-to-r from-red-600 to-red-800 p-8 transition-all duration-300 ease-in-out hover:shadow-red-500/20 hover:from-red-500 hover:to-red-700 w-full`, buttonStyle)}
                style={{ '--button-glow-color': '239, 68, 68' } as React.CSSProperties}
              >
                <div className="relative z-10 flex items-center space-x-4">
                  <div className="rounded-full bg-white/10 p-2 transition-transform duration-300 group-hover:scale-110">
                    <Image
                      src="/youtube.png"
                      alt="YouTube Logo"
                      width={32}
                      height={32}
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <span className="text-xl font-semibold text-white transition-all duration-300 group-hover:translate-x-1">YouTube</span>
                </div>

                <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 opacity-10 transition-opacity duration-300 group-hover:opacity-20">
                  <Image
                    src="/youtube.png"
                    alt=""
                    width={120}
                    height={120}
                    className="transition-transform duration-300 group-hover:rotate-12"
                  />
                </div>
              </button>

              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className={getButtonClasses(`group relative overflow-hidden bg-gradient-to-r from-red-600/80 to-red-800/80 p-4 transition-all duration-300 ease-in-out hover:shadow-red-500/20 hover:from-red-500/80 hover:to-red-700/80 w-full flex items-center justify-center`, buttonStyle)}
              >
                <span className="text-lg font-semibold text-white">Go to YouTube </span>
              </a>
            </div>
          </div>

          {selectedPlatform && (
            <div className="w-full max-w-2xl mx-auto mt-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">


                {platformStats && (
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Viewers</p>
                      <p className="text-xl font-bold text-gray-800 dark:text-white">{formatNumber(platformStats.totalViewers)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Active Broadcasters</p>
                      <p className="text-xl font-bold text-gray-800 dark:text-white">{platformStats.activeBroadcasters}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Top Category</p>
                      <p className="text-xl font-bold text-gray-800 dark:text-white">{platformStats.topCategory}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedPlatform && recommendedStreams.length > 0 && (
            <div className="w-full max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center text-black">
                Recommended {selectedPlatform === "twitch" ? "Streams" : "Videos"}
              </h2>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recommendedStreams.map((stream) => (
                    <a
                      key={stream.id}
                      href={stream.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block overflow-hidden rounded-xl bg-white/5 border border-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg ${selectedPlatform === "twitch" ? "hover:shadow-purple-500/20" : "hover:shadow-red-500/20"}`}
                    >
                      <div className="relative">
                        <div className="aspect-video bg-gray-800 relative">
                          <Image
                            src={stream.thumbnailUrl}
                            alt={stream.title}
                            fill
                            className="object-cover"
                            unoptimized={stream.thumbnailUrl.startsWith('http')}
                          />
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm flex items-center gap-2">
                            <span className="bg-gray-700/50 px-2 py-0.5 rounded">{stream.category}</span>
                            <span>{formatNumber(stream.viewerCount)} viewers</span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-lg line-clamp-1 text-black">{stream.title}</h3>
                          <p className="text-sm text-black mt-1">{stream.streamerName}</p>
                          <p className="text-xs text-black mt-1">{stream.category}</p>
                          <p className="text-xs text-black mt-1">{stream.duration} minutes</p> 
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
                
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
