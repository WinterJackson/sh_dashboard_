import Link from "next/link";

export default function NotFound() {
    return (
        <div>
            <h2>Doctor Not Found</h2>
            <p>Could not find the requested doctor</p>
            <Link href="/dashboard/doctors">Return to Doctors</Link>
        </div>
    );
}
