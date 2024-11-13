import styles from "./page.module.css";
import Link from 'next/link';

export default function Home() {
  // this component is the base page/landing page
  return (
    <div className="landingPage">
      <h1>Citizen Science App</h1>
      <p>Hello welcome to the landing page for the citizen science app!</p>
      <p>From this website you can:</p>
      <ul>
        <li>Create a new project</li>
        <li>Create observation forms</li>
        <li>View different projects you've created</li>
        <li>See the data visualized into a singular place</li>
      </ul>
      <div className="loginBox">
        <p>Already a member?</p>
        <Link href="/login">Login Here!</Link>
        <p>Looking to get started?</p>
        <Link href="/login/register">Register Here!</Link>
      </div>
    </div>
  );
}
