import { useState, useEffect, useRef } from "react";

export function useDrag(svgRef, svgW) {
  const [colOffsets, setColOffsets] = useState([0, 0, 0, 0, 0]);
  const dragRef = useRef(null);

  const startDrag = (col, e) => {
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    dragRef.current = { col, startX: clientX, startOffset: colOffsets[col] };
  };

  useEffect(() => {
    const onMove = e => {
      if (!dragRef.current) return;
      if (e.buttons === 0) { dragRef.current = null; return; }
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const dx      = clientX - dragRef.current.startX;
      const svgEl   = svgRef.current ? svgRef.current.querySelector("svg") : null;
      const scale   = svgEl ? svgW / svgEl.getBoundingClientRect().width : 1;
      const raw     = dragRef.current.startOffset + dx * scale;
      if (!isFinite(raw)) return;
      const col     = dragRef.current.col;
      // Each column has asymmetric limits based on which direction makes sense
      const limitL  = (col === 0) ? 0 : svgW * 0.10;  // col 0 can't go left
      const limitR  = (col === 4) ? 0 : svgW * 0.10;  // col 4 can't go right
      const clamped = Math.max(-limitL, Math.min(limitR, raw));
      setColOffsets(prev => {
        const next = [...prev];
        next[dragRef.current.col] = clamped;
        return next;
      });
    };
    const onUp = () => { 
      dragRef.current = null;
      setColOffsets([0, 0, 0, 0, 0]);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend",  onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend",  onUp);
    };
  }, [svgRef, svgW]);

  return { colOffsets, startDrag };
}
