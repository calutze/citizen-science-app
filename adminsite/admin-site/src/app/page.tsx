import Link from 'next/link';

export default function Home() {
  // this component is the base page/landing page
  return (
    <div className="landingPage">
      <h1 className="websiteHeader">Citizen Science App</h1>
      <h2>Hello welcome to the teacher site for the citizen science app!</h2>
      <h3>From this website you can:</h3>
      <ul>
        <li>Create a new project</li>
        <li>Create observation forms</li>
        <li>View different projects you&apos;ve created</li>
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
