"use client";

import { useEffect, useRef, useState } from "react";

const DEFAULT_ID = "2bB-n8siBPE";

export default function YoutubeBackground({
  videoId = DEFAULT_ID,
  className = "exp-band",
  poster = "/images/yt-2bB-n8siBPE.jpg",
}) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px", threshold: 0 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const src = active
    ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&disablekb=1&fs=0&iv_load_policy=3&loop=1&playlist=${videoId}&modestbranding=1&playsinline=1&rel=0&showinfo=0&vq=hd1080&hd=1`
    : null;

  return (
    <div
      className={className}
      ref={ref}
      style={poster ? { backgroundImage: `url(${poster})` } : undefined}
    >
      <div className="exp-band-media">
        {src ? (
          <iframe
            src={src}
            title=""
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : null}
      </div>
    </div>
  );
}
