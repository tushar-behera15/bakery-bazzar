import React from "react";
import { ShieldAlert } from "lucide-react";
import { ProgressBarLink } from "./ProgressLink";

const AccessDenied = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-primary/5 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">

                {/* Icon */}
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <ShieldAlert className="h-8 w-8 text-primary" />
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-900">
                    Access Denied
                </h1>

                {/* Description */}
                <p className="mt-3 text-gray-600">
                    You don’t have permission to view this page.
                    Please contact the administrator or go back.
                </p>

                {/* Actions */}
                <div className="mt-6 flex gap-3 justify-center">
                    <button
                        onClick={() => window.history.back()}
                        className="px-5 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition"
                    >
                        Go Back
                    </button>

                    <ProgressBarLink
                        href="/"
                        className="px-5 py-2 rounded-lg bg-primary text-white hover:opacity-90 transition"
                    >
                        Home
                    </ProgressBarLink>
                </div>
            </div>
        </div>
    );
};

export default AccessDenied;
