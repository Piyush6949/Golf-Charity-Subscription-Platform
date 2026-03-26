"use client";

import { useEffect, useRef, type RefObject, type DependencyList } from "react";

export function useReveal(deps: DependencyList = []): RefObject<HTMLDivElement | null> {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    }
                });
            },
            { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
        );

        const children = el.querySelectorAll(
            ".reveal, .reveal-left, .reveal-right, .reveal-scale"
        );
        children.forEach((child) => observer.observe(child));

        if (
            el.classList.contains("reveal") ||
            el.classList.contains("reveal-left") ||
            el.classList.contains("reveal-right") ||
            el.classList.contains("reveal-scale")
        ) {
            observer.observe(el);
        }

        return () => observer.disconnect();
    }, deps);

    return ref;
}
