import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import "./Gallery.less";

gsap.registerPlugin(Flip, ScrollTrigger);

const Gallery = () => {
  const [layout, setLayout] = useState({
    state: null,
    isSingleColumn: false,
  });
  const [hoveredIndex, setHoveredIndex] = useState(null); // New feature: hovered image index
  const scopeRef = useRef();
  const q = gsap.utils.selector(scopeRef);
  const { context, contextSafe } = useGSAP(
    () => {
      if (layout.state) {
        Flip.from(layout.state, {
          absolute: true,
          ease: "power1.inOut",
          targets: q("img"),
          scale: true,
          simple: true,
          duration: 2,
        });
      }
    },
    {
      scope: scopeRef,
      dependencies: [layout],
    }
  );

  const handleToggleLayout = contextSafe(() => {
    setLayout((prev) => ({
      state: Flip.getState(q("img")),
      isSingleColumn: true,
    }));
  });

  const handleGalleryLayout = contextSafe(() => {
    setLayout((prev) => ({
      state: Flip.getState(q("img")),
      isSingleColumn: false,
    }));
  });

  const countOfImages = [5, 6, 6, 6, 5, 4];
  const imageIndexes = [];
  let sum = 0;
  for (let i = 0; i < countOfImages.length; i++) {
    const indexes = [];
    for (let j = 0; j < countOfImages[i]; j++) indexes.push(sum + j + 1);
    imageIndexes.push(indexes);
    sum += countOfImages[i];
  }

  const { isSingleColumn } = layout;
  const [offset, setOffset] = useState({ x: 770, y: 512 });
  const [mousePosition, setMousePosition] = useState({ x: 770, y: 512 });

  const handleMouseMove = (event) => {
    const viewport = document.querySelector(".viewport");
    const rect = viewport.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    setMousePosition({ x: mouseX, y: mouseY });
    const offsetX = ((mouseX - rect.width / 2) / rect.width) * (2232 - 1440) - 120;
    const offsetY = ((mouseY - rect.height / 2) / rect.height) * (2000 - 1024);
    setOffset({ x: -offsetX, y: -offsetY });
  };

  useEffect(() => {
    const viewport = document.querySelector(".viewport");
    if (!isSingleColumn) {
      viewport.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      viewport.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isSingleColumn]);

  useEffect(() => {
    if (isSingleColumn) {
      gsap.from(".big-img", {
        opacity: 0,
        duration: 2,
        ease: "power2.out",
        delay: 0.9,
      });

      const textElements = document.querySelectorAll(".big-gallery>.col:nth-child(1)>.text_box:nth-child(1) p");
      textElements.forEach((el) => {
        const split = new SplitType(el, { types: "lines", lineClass: "line" });

        split.lines.forEach((line) => {
          const wrapper = document.createElement("div");
          wrapper.classList.add("line-wrapper");
          line.parentNode.insertBefore(wrapper, line);
          wrapper.appendChild(line);
        });

        gsap.from(split.lines, {
          opacity: 0,
          y: '100%',
          duration: 1,
          ease: "power3",
          delay: 1,
          stagger: {
            each: 0.1,
          },
        });
      });
    }
  }, [isSingleColumn]);

  const handleMouseOver = useCallback(
    (index) => {
      setHoveredIndex(index);
    },
    [setHoveredIndex]
  );

  const handleMouseOut = useCallback(() => {
    setHoveredIndex(null);
  }, [setHoveredIndex]);

  return (
    <div className={`viewport ${isSingleColumn ? "single-viewport" : ""}`}>
      <nav className="navbar">
        <div className="logo">
          <button className="logo_button"><h2>Hiromi<br />Tomiyasu</h2></button>
        </div>
        <div className="group_button">
          <button className="button1" onClick={handleGalleryLayout}>
            <h3>Gallery</h3>
            <svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="8" width="2" height="2" fill="#4B4B4B" />
              <rect x="8" y="8" width="2" height="2" fill="#4B4B4B" />
              <rect width="2" height="2" fill="#4B4B4B" />
              <rect y="8" width="2" height="2" fill="#4B4B4B" />
              <rect x="12" y="4" width="2" height="2" fill="#4B4B4B" />
              <rect x="4" y="4" width="2" height="2" fill="#4B4B4B" />
              <rect x="16" width="2" height="2" fill="#4B4B4B" />
              <rect x="16" y="8" width="2" height="2" fill="#4B4B4B" />
            </svg>
          </button>
          <button className="button2" onClick={handleToggleLayout}>
            <h3>Index</h3>
            <svg width="23" height="10" viewBox="0 0 23 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="7" width="2" height="2" fill="#4B4B4B" />
              <rect x="7" y="8" width="2" height="2" fill="#4B4B4B" />
              <rect width="2" height="2" fill="#4B4B4B" />
              <rect y="8" width="2" height="2" fill="#4B4B4B" />
              <rect x="14" width="2" height="2" fill="#4B4B4B" />
              <rect x="14" y="8" width="2" height="2" fill="#4B4B4B" />
              <rect x="21" width="2" height="2" fill="#4B4B4B" />
              <rect x="21" y="8" width="2" height="2" fill="#4B4B4B" />
            </svg>
          </button>
          <button className="button3" onClick={handleToggleLayout}>
            <h3>Contact</h3>
          </button>
        </div>
      </nav>
      <div
        className="content"
        style={
          isSingleColumn
            ? {}
            : { transform: `translate(${offset.x}px, ${offset.y}px)` }
        }
      >
        <div className="gallery" ref={scopeRef}>
          <div className={`row ${isSingleColumn ? "single" : ""}`}>
            {imageIndexes.map((indexes, rowIndex) => (
              <div className={`col`} key={rowIndex}>
                {indexes.map((index, colIndex) => (
                  <div
                    className={`image ${
                      hoveredIndex === index ? "hovered" : hoveredIndex !== null ? "dimmed" : ""
                    }`}
                    key={colIndex}
                    onMouseOver={() => handleMouseOver(index)}
                    onMouseOut={handleMouseOut}
                  >
                    <img src={`/images/Image_${index}.jpg`} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {isSingleColumn && (
          <div className="big-gallery">
            {imageIndexes.map((indexes, idx) => (
              <div className={`col`} key={idx}>
                {indexes.map((index, idx) => (
                  <div className="text_box image-big" key={idx}>
                    <p className="text_box number">[23]</p>
                    <p className="text_box helper_d">[Date]</p>
                    <p className="text_box helper_d_v">06.23.2024</p>
                    <p className="text_box helper_t">[Title, JPN / ENG ]</p>
                    <p className="text_box helper_t_v">“Hamon, Egan” — Ripple, Smile</p>
                    <div className="big-img-text">
                      <img src={`/images/Image_${index}.jpg`} className="big-img" />
                      <div className="text">
                        <p className="text_box helper_p">[Production]</p>
                        <p className="text_box helper_p_v">Interior Design</p>
                        <p className="text_box helper_d">[Description]</p>
                        <p className="text_box helper_d_v">Gallagher’s compositions variably map and notate this nebulous and protean in-between space. The distinct, yet interrelated works comprising All of No Man’s Land Is Ours demarcate a site of possibility built up through repeated units of will. Indeed, the unit—the brushstroke.</p>
                        <p className="text_box helper_l">[Related link]</p>
                        <p className="text_box helper_l_v">www.toro-museum.co.jp</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
