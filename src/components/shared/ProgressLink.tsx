/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { cn } from "@/lib/utils";
import {
    AnimatePresence,
    motion,
    useMotionTemplate,
    useSpring,
} from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    ComponentProps,
    ReactNode,
    createContext,
    startTransition,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
interface ProgressBarLinkProps extends ComponentProps<typeof Link> {
    activeClassName?: string;
}
const ProgressBarContext = createContext<ReturnType<typeof useProgress> | null>(
    null
);

export function useProgressBar() {
    const progress = useContext(ProgressBarContext);

    if (progress === null) {
        throw new Error("Need to be inside provider");
    }

    return progress;
}

export function ProgressBar({
    className,
    children,
}: {
    className: string;
    children: ReactNode;
}) {
    const progress = useProgress();
    const width = useMotionTemplate`${progress.value}%`;

    return (
        <ProgressBarContext.Provider value={progress}>
            <AnimatePresence onExitComplete={progress.reset}>
                {progress.state !== "complete" && (
                    <motion.div
                        style={{ width }}
                        exit={{ opacity: 0 }}
                        className={"fixed top-0 left-0 w-screen z-999! " + className}
                    />
                )}
            </AnimatePresence>
            {children}
        </ProgressBarContext.Provider>
    );
}

export function ProgressBarLink({
    href,
    children,
    className,
    activeClassName = "text-primary/60",
    ...rest
}: ProgressBarLinkProps) {
    const progress = useProgressBar();
    const router = useRouter();
    const path = usePathname();
    const currentPath =
        typeof href === "string" ? href : href.pathname ?? href.toString();
    const isActive = path === currentPath;
    return (
        <Link
            href={href}
            onClick={(e) => {
                e.preventDefault();
                progress.start();
                startTransition(() => {
                    router.push(href.toString());
                    progress.done();
                });
            }}
            className={cn(className, isActive && activeClassName)}
            {...rest}
        >
            {children}
        </Link>
    );
}

function useProgress() {
    const [state, setState] = useState<
        "initial" | "in-progress" | "completing" | "complete"
    >("initial");

    const value = useSpring(0, {
        damping: 25,
        mass: 0.5,
        stiffness: 300,
        restDelta: 0.1,
    });

    useInterval(
        () => {
            // If we start progress but the bar is currently complete, reset it first.
            if (value.get() === 100) {
                value.jump(0);
            }

            const current = value.get();

            let diff;
            if (current === 0) {
                diff = 15;
            } else if (current < 50) {
                diff = rand(1, 10);
            } else {
                diff = rand(1, 5);
            }

            value.set(Math.min(current + diff, 99));
        },
        state === "in-progress" ? 750 : null
    );

    useEffect(() => {
        if (state === "initial") {
            value.jump(0);
        } else if (state === "completing") {
            value.set(100);
        }

        return value.on("change", (latest: any) => {
            if (latest === 100) {
                setState("complete");
            }
        });
    }, [value, state]);

    function reset() {
        setState("initial");
    }

    function start() {
        setState("in-progress");
    }

    function done() {
        setState((state) =>
            state === "initial" || state === "in-progress" ? "completing" : state
        );
    }

    return { state, value, start, done, reset };
}

function rand(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function useInterval(callback: () => void, delay: number | null) {
    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick() {
            savedCallback.current();
        }

        if (delay !== null) {
            tick();

            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}